import { ControllerConstructor } from '../decorators/RouteController';
import { Route } from './Route';

export class RouteManager {
    static routeManagers: Map<string, RouteManager> = new Map();
    routes: Map<string, Route> = new Map();

    constructor(readonly gateway: string) {}

    static create(gateway: string) {
        let routeManager = this.routeManagers.get(gateway);
        if (!routeManager) {
            routeManager = new RouteManager(gateway);
            this.routeManagers.set(gateway, routeManager);
        }

        return routeManager;
    }

    static get(gateway: string) {
        return this.routeManagers.get(gateway);
    }

    addRoute(filename: string, Controller: ControllerConstructor) {
        const route = new Route(filename, Controller);
        const uri = `v${route.version}/${route.api}`;

        console.log('register route controller: ' + this.gateway + uri);

        this.routes.set(uri, route);
    }

    match(uri: string, method: string) {
        const route = this.routes.get(uri);
        if (route && (route.methods === null || route.methods.includes(method))) {
            return route;
        }

        return null;
    }
}
