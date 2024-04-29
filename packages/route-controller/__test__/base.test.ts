import { describe, expect, test, beforeAll } from 'vitest';
import Koa from 'koa';
import request from 'supertest';
import * as http from 'http';
import * as path from 'path';
import { routeController } from '../src';

const app = new Koa();

beforeAll(async () => {
    app.use(
        routeController({
            entry: path.join(__dirname, '../example/scope1'),
            timeout: 1000,
        }),
    );

    app.use(
        routeController({
            entry: path.join(__dirname, '../example/scope2'),
            gateway: 'api2',
            timeout: 2000,
        }),
    );

    /**
     * Delay 500ms after registering a route to prevent interface failure
     *  caused by requesting an interface before the route is fully registered
     */
    await (() =>
        new Promise((resolve) => {
            setTimeout(resolve, 500);
        }))();
});

describe('request with/without params', () => {
    test('request with param id', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v1/user/getInfo?id=123');

        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toEqual({
            name: 'lsshuai',
            age: 28,
            sex: 'male',
        });
    });
    test('request without param id', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v1/user/getInfo');
        expect(res.body.code).toEqual(500);
        expect(res.body.msg).toEqual('Parameter id is required');
        expect(res.body.data).toBeNull();
    });
    test('request without param id by post', async () => {
        const res = await request(http.createServer(app.callback())).post('/api/v1/user/getInfo').send('id=123');
        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toEqual({
            name: 'lsshuai',
            age: 28,
            sex: 'male',
        });
    });
});

describe('request method', () => {
    test('request by GET method', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v1/admin/checkPermission?name=lsshuai');
        expect(res.body.code).toEqual(500);
        expect(res.body.msg).toEqual('Can not find api controller');
        expect(res.body.data).toBeNull();
    });
    test('request by POST method', async () => {
        const res = await request(http.createServer(app.callback()))
            .post('/api/v1/admin/checkPermission')
            .send('name=lsshuai');
        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toBeTruthy();
    });
});

describe('request timeout', () => {
    test('request exceeds default delay', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v2/timeout/defaultTimeout');

        expect(res.body.code).toEqual(500);
        expect(res.body.msg).toEqual('Request timeout');
        expect(res.body.data).toBeNull();
    });
    test('request exceeds custom delay - No param', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v2/timeout/customTimeout');

        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toEqual('hello');
    });
    test('request exceeds custom delay - with timeout: 2000', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v2/timeout/customTimeout?timeout=2000');

        console.log(res.body);
        expect(res.body.code).toEqual(500);
        expect(res.body.msg).toEqual('Request timeout');
        expect(res.body.data).toBeNull();
    });
});

describe('register api by multiple instance', () => {
    test('request api from instance: scope1', async () => {
        const res = await request(http.createServer(app.callback())).get('/api/v2/test?scope=1');

        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toEqual({ scope: '1', isRes: true });
    });
    test('request api from instance: scope2', async () => {
        const res = await request(http.createServer(app.callback())).get('/api2/v1/test?scope=2');

        expect(res.body.code).toEqual(200);
        expect(res.body.msg).toEqual('');
        expect(res.body.data).toEqual({ scope: '2', isRes: true });
    });
});
