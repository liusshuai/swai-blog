const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['selector', '[data-theme="dark"]'],
    presets: [require('@swai/ui/tailwind.config')],
    content: ['./src/**/*.{ts,tsx}', './node_modules/@swai/ui/lib/**/*.js'],
    theme: {
        extend: {
            screens: {
                ...defaultTheme.screens,
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
                    '--nav-height': '60px',
                    '--container-padding': '40px',
                },
            });
        }),
    ],
};
