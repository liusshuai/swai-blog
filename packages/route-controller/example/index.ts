import Koa from 'koa';
import path from 'path';
import { routeController } from '../src';

const app = new Koa();

app.use(
    routeController({
        entry: path.join(__dirname, './scope1'),
        timeout: 2000,
    }),
);

// app.use(
//     routeController({
//         entry: path.join(__dirname, './scope2'),
//         gateway: 'api2',
//         timeout: 2000,
//     }),
// );

app.listen(3001);
