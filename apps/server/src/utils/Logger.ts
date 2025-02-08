import path from 'path';
import log4js from 'log4js';
import chalk from 'chalk';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        datefile: {
            type: 'dateFile',
            numBackups: 60,
            alwaysIncludePattern: true,
            keepFileExt: true,
            filename: path.resolve(process.cwd(), `../../../runtime/logs/runtime.log`),
        },
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        runtime: { appenders: ['datefile'], level: 'info' },
        routeController: {
            appenders: ['console', 'datefile'],
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        },
    },
});

interface LoggerOptions {
    label?: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
}

function getDate() {
    const now = new Date();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();
    const HH = now.getHours();
    const mm = now.getMinutes();
    const ss = now.getMilliseconds();

    const format = (val: number) => {
        return val > 9 ? val : `0${val}`;
    };

    return `${format(MM)}-${format(DD)} ${format(HH)}:${format(mm)}:${format(ss)}`;
}

function loggerFormat(options: LoggerOptions) {
    const { level, message, label } = options;

    const level_map = {
        debug: chalk.magenta('VERB'),
        info: chalk.blue('INFO'),
        warn: chalk.yellow('WARNING!'),
        error: chalk.red('ERROR!'),
    };

    return `${chalk.dim(getDate())} ${level_map[level]} ${label ? chalk.green(label) : ''} ${message}`;
}

export function getLogger(name: string, label?: string) {
    const logger = log4js.getLogger(name) || log4js.getLogger('runtime');

    const createLogger = (level: LoggerOptions['level']) => {
        return (message?: string, ...args: string[]) => {
            logger[level](
                loggerFormat({
                    level,
                    label,
                    message: message || '',
                }),
                args,
            );
        };
    };

    return {
        debug: createLogger('debug'),
        info: createLogger('info'),
        warn: createLogger('warn'),
        error: createLogger('error'),
    };
}

export const runtimeLogger = log4js.getLogger('runtime');
