import { ControllerConstructor } from './RouteController';

export function RouteMethod(...methods: string[]): (target: ControllerConstructor) => void {
    return (target) => {
        target.methods = methods;
    };
}
