import path from 'path';
import { DataSource } from 'typeorm';
import config from './serverConfig';

const database = config.get('database');

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: database.host,
    username: database.username,
    password: database.password,
    database: database.database,
    port: 3306,
    entities: [path.join(__dirname, '../entity/*.ts')],
    synchronize: true,
});

AppDataSource.initialize().then(() => {
    console.log('sql connect success');
}).catch((e) => {
    console.log('sql connect error: ', e.message);
});
