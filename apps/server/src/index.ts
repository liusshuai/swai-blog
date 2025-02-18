import Koa from 'koa';
import path from 'path';
import session from 'koa-session';
import { routeController } from '@swai/route-controller';
import 'reflect-metadata';
const cors = require('@koa/cors');
import './common/database';
import { terminateMailerQueue } from './queue/mailerQueue';

const app = new Koa();

app.keys = ['lsshuaisl', 'liushuai', 'cameron monaghan'];
app.use(
    session(
        {
            key: app.keys[0],
            maxAge: 7 * 24 * 60 * 60 * 1000, // 一周
        },
        app,
    ),
);

app.use(
    cors({
        origin: (ctx: any) => {
            const origin = ctx.get('origin');

            return origin;
        },
        allowMethods: 'GET,POST',
        credentials: true,
    }),
);

app.use(
    routeController({
        entry: path.join(__dirname, './controller'),
        timeout: 2000,
    }),
);

app.listen(process.env.PORT);

process.on('SIGINT', async () => {
    await terminateMailerQueue();

    process.exit(0);
});
