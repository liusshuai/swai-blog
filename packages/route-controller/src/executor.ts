import type { Middleware, Context, Next } from 'koa';
import { clone, size, defaults } from 'lodash';
import parse from 'co-body';
import { RouteManager } from './route/RouteManager';
import { Route } from './route/Route';
import { RouteLoader } from './route/RouteLoader';

export interface BaseControllerExecutorOptions {
    entry: string;
    gateway?: string;
    timeout?: number;
}

export class BaseControllerExecutor {
    readonly entry: string;
    readonly gateway: string;
    readonly requestTimeout: number;
    readonly routeManager: RouteManager;

    constructor({ entry, gateway, timeout }: BaseControllerExecutorOptions) {
        this.entry = entry;
        this.gateway = gateway ? `/${gateway.replace(/(^\/|\/$)/, '')}/` : '/api/';
        this.requestTimeout = timeout || 500;
        this.routeManager = RouteManager.create(this.gateway);

        RouteLoader.load(this.gateway, this.entry);
    }

    get middleware(): Middleware {
        return this.execute.bind(this);
    }

    protected async execute(ctx: Context, next: Next): Promise<void> {
        const _path = ctx.path;
        if (!_path.startsWith(this.gateway)) {
            return next();
        }

        const uri = _path.slice(this.gateway.length);
        const route = this.routeManager.match(uri, ctx.method.toLocaleLowerCase());

        if (route === null) {
            return this.send(ctx, new RouteFailedResult(new Error('Can not find api controller')));
        }

        const params = await this.getParams(ctx);

        const startTime = Date.now();
        const result = await this.invoke(ctx, route, params);
        console.info(`${ctx.path} invoked in ${Date.now() - startTime}ms`);

        if (typeof ctx.body !== 'undefined') {
            return;
        }

        if (typeof result !== 'undefined') {
            this.send(ctx, result);
        } else {
            this.send(ctx, new RouteFailedResult(new Error('Empty response')));
        }
    }

    protected async getParams(ctx: Context) {
        let params: any;

        if (ctx.method === 'GET' || typeof ctx.header['content-type'] === 'undefined') {
            params = clone(ctx.query);
        } else {
            try {
                params = await parse(ctx.req);
            } catch (e) {
                console.error(`Fail to prase params from request body: ${e.message}`);
                params = {};
            }

            if (size(params) > 0) {
                defaults(params, ctx.query);
            }
        }

        return params;
    }

    protected invoke(ctx: Context, route: Route, params: any): Promise<RouteFailedResult | undefined> {
        return new Promise((resolve) => {
            let timer: any;
            let result: any;

            timer = setTimeout(() => {
                timer = null;
                resolve(new RouteFailedResult(new Error('Request timeout')));
            }, route.Controller.timeout || this.requestTimeout);

            const doError = (e: Error) => {
                console.error(`${ctx.path} invoke failed: ${e.message}`);
                result = new RouteFailedResult(e);
            };

            try {
                result = route.controller.execute(params, ctx);
                if (result && typeof result.then === 'function') {
                    result
                        .then(resolve)
                        .catch((e: Error) => {
                            doError(e);
                            resolve(result);
                        })
                        .finally(() => {
                            timer && clearTimeout(timer);
                        });
                    return;
                }
            } catch (e) {
                doError(e);
            }

            timer && clearTimeout(timer);
            resolve(result);
        });
    }

    protected send(ctx: Context, result: RouteControllerResult): void {
        if (ctx.headerSent) return;

        ctx.status = 200;
        ctx.type = 'json';
        ctx.body = result;
    }
}

export class RouteControllerResult<R = any> {
    code: number = 200;
    msg: string = '';

    constructor(readonly data: R) {}

    get result() {
        return {
            code: this.code,
            msg: this.msg,
            data: this.data,
        };
    }
}

export class RouteFailedResult extends RouteControllerResult<null> {
    code: number = 500;
    msg: string = '';
    constructor(e: Error) {
        super(null);
        this.msg = e.message;
    }
}
