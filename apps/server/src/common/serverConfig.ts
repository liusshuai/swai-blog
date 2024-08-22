import { ServerConfig } from '../utils/ServerConfig';

export default new ServerConfig({
    yuque: {
        baseUrl: 'https://www.yuque.com/api/v2',
        authToken: '',
        bookId: undefined,
        login: '',
    },
    database: {
        host: '',
        username: '',
        password: '',
        database: '',
    },
    wx: {
        token: '',
    },
    mailer: {
        host: '',
        username: '',
        password: '',
    },
    admin: {
        email: '',
        nickname: '',
    },
});
