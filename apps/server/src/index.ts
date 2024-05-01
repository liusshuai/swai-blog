import Koa from 'koa';
import path from 'path';
import { routeController } from '@swai/route-controller';
const cors = require('@koa/cors');

const app = new Koa();

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
