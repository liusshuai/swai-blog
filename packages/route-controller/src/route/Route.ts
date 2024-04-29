import * as path from 'path';
import { camelCase } from 'lodash';
import { ControllerConstructor, IController } from '../decorators/RouteController';

export class Route {
    className: string;
    version: number;
    routePath: string[] = [];
    controller: IController<any, any>;

    constructor(
        filename: string,
        readonly Controller: ControllerConstructor,
    ) {
        this.className = path.basename(filename, path.extname(filename));
        this.version = Controller.version || 1;
        this.controller = new Controller();

        const confs = path.dirname(filename).match(/v[0-9](\/.+)?/);

        if (confs && confs[0]) {
            const [version, ...restPath] = confs[0].split(path.sep);
            if (/^v[0-9]$/.test(version)) {
                this.version = +version.replace('v', '');
                this.routePath = restPath;
            } else {
                this.routePath = [version, ...restPath];
            }
        }
    }

    get actionName(): string {
        return camelCase(this.className.replace(/controller/i, ''));
    }

    get api(): string {
        if (this.Controller.api) {
            return this.Controller.api;
        }

        return this.routePath.concat(this.actionName).join('/');
    }

    get methods(): string[] | null {
        return (this.Controller.methods as string[]) || null;
    }
}
