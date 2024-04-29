import { ControllerConstructor } from './RouteController';

export function RouteTimeout(timeout: number): (traget: ControllerConstructor) => void {
    return (target) => {
        target.timeout = timeout;
    };
}
