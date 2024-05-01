module.exports = {
    apps: [
        {
            name: 'server',
            script: 'pnpm',
            args: 'start',
            watch: true,
            env: {
                PORT: 3001,
                NODE_ENV: 'production',
            },
        }
    ],
};
