import path from 'path';
import globby from 'globby';
import { ControllerConstructor } from '../decorators/RouteController';
import { RouteManager } from './RouteManager';

export class RouteLoader {
    static loaded: Map<string, ControllerConstructor> = new Map();

    static async load(gateway: string, entry: string) {
        const router = RouteManager.get(gateway);

        if (!router) {
            throw new Error(`Can not find router witch gateway is [${gateway}]`);
        }

        const files = globby.sync('**/v+([0-9])/**/*.{js,ts}', {
            cwd: entry,
            caseSensitiveMatch: false,
        });

        for (const file of files) {
            const filename = path.resolve(entry, file);
            if (!this.loaded.has(filename)) {
                await import(filename);
            }

            const Controller = this.loaded.get(filename);
            if (Controller) {
                router.addRoute(filename, Controller);
            }
        }
    }

    static register(filename: string, Controller: ControllerConstructor) {
        if (this.loaded.has(filename)) {
            throw new Error('Duplicated controller');
        }
        this.loaded.set(filename, Controller);
    }
}
