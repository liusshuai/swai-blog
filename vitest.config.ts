import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environmentMatchGlobs: [['packages/*', 'jsdom']],
    },
});
