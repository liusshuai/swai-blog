module.exports = {
    apps: [
        {
            name: 'app',
            script: 'pnpm',
            args: 'start',
            watch: true,
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
            },
        },
    ],
};
