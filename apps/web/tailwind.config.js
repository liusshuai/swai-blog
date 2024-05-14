const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['selector', '[data-theme="dark"]'],
    presets: [require('@swai/ui/tailwind.config')],
    content: ['./src/**/*.{ts,tsx}', './node_modules/@swai/ui/lib/**/*.js'],
    theme: {
        extend: {
            width: {
                layout: 'var(--layout-width)',
            },
            maxWidth: {
                layout: 'var(--layout-width)',
            },
            spacing: {
                nav: 'var(--nav-height)',
                container: 'var(--container-padding)',
            },
            backgroundColor: ({ theme }) => ({
                page: {
                    DEFAULT: theme('colors.gray.100'),
                    dark: '#121212',
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        plugin(function ({ addBase, addComponents, theme }) {
            addBase({
                ':root': {
                    '--layout-width': '1200px',
                    '--nav-height': '48px',
                    '--container-padding': '16px',
                },
                [`@media (min-width: ${theme('screens.tablet')})`]: {
                    ':root': {
                        '--nav-height': '86px',
                        '--container-padding': '40px',
                    },
                },
            });

            addComponents({
                '.container': {
                    maxWidth: theme('maxWidth.layout'),
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: theme('spacing.container'),
                    paddingRight: theme('spacing.container'),
                },
            });
        }),
    ],
};
