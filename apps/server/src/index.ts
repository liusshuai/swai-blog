import Koa from 'koa';
import path from 'path';
import session from 'koa-session';
import { routeController } from '@swai/route-controller';
import 'reflect-metadata';
const cors = require('@koa/cors');
import './common/database';

const app = new Koa();

app.keys = ['lsshuaisl', 'liushuai', 'cameron monaghan'];
app.use(session({
    key: app.keys[0],
    maxAge: 86400000,
}, app));

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
