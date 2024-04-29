import { BaseControllerExecutor, type BaseControllerExecutorOptions } from './executor';

export function routeController(options: BaseControllerExecutorOptions) {
    return new BaseControllerExecutor(options).middleware;
}

export * from './executor';
export * from './decorators';
