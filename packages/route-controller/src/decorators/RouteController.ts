import caller = require('caller');
import type { Context } from 'koa';
import { RouteLoader } from '../route/RouteLoader';
import { RouteControllerResult } from '../executor';

export interface IController<P, R> {
    execute(params: P, ctx: Context): R;
}

export interface SyncRouteController<P, R> extends IController<P, RouteControllerResult<R>> {
    execute(params: P, ctx: Context): RouteControllerResult<R>;
}

export interface AsyncRouteController<P, R> extends IController<P, Promise<RouteControllerResult<R>>> {
    execute(params: P, ctx: Context): Promise<RouteControllerResult<R>>;
}

export interface RouteControllerConfigs {
    api?: string;
    methods?: string[] | string;
    timeout?: number;
}

export interface ControllerConstructor extends RouteControllerConfigs {
    version?: number;

    new (): IController<any, any>;
}

export function RouteController(): (target: ControllerConstructor) => void;
export function RouteController(options?: RouteControllerConfigs): (target: ControllerConstructor) => void;
export function RouteController(api?: string, method?: string | string[]): (target: ControllerConstructor) => void;
export function RouteController(api?: string | RouteControllerConfigs, methods?: string | string[]) {
    return (target: ControllerConstructor) => {
        let depth: number = 1;
        let filename: string;

        do {
            filename = caller(depth++);

            if (filename.startsWith('internal/')) {
                throw new Error('Can not locate route');
            }
        } while (/node_modules\/(tslib|reflect-metadata)/.test(filename));

        if (api) {
            if (typeof api === 'string') {
                target.api = api;
            } else {
                if (api.api) {
                    target.api = api.api;
                }

                if (api.methods) {
                    target.methods = api.methods;
                }

                if (api.timeout) {
                    target.timeout = api.timeout;
                }
            }
        }

        if (methods) {
            if (typeof methods === 'string') {
                target.methods = [methods.toLocaleLowerCase()];
            }
            if (Array.isArray(methods)) {
                target.methods = [...methods.map((method) => method.toLocaleLowerCase())];
            }
        }

        RouteLoader.register(filename, target);
    };
}
