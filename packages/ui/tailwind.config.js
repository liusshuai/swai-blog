const plugin = require('tailwindcss/plugin');
// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        screens: {
            mobile: { max: '719px' },
            tablet: '720px',
            desktop: '1024px'
        },
        colors: {
            inherit: 'inherit',
            transparent: 'transparent',
            current: 'currentColor',
            white: '#FFF',
            black: '#000',
            primary: '#5E7CE0',
            link: {
                DEFAULT: '#526ECC',
                dark: '#96ADFA',
                hover: '#344899',
            },
            info: '#5E7CE0',
            error: '#F66F6A',
            warn: '#FA9841',
            success: '#3AC295',
            gray: {
                DEFAULT: '#7F7F7F',
                50: '#F5F5F6',
                100: '#EEF0F5',
                200: '#DFE1E6',
                300: '#ADB0B8',
                400: '#8A8E99',
                500: '#575D6C',
                600: '#252B3A',
                700: '#5C6173',
                800: '#464C59',
                900: '#282B33',
            },
            blue: {
                DEFAULT: '#5E7CE0',
                50: '#F2F5FC',
                100: '#E9EDFA',
                200: '#BECCFA',
                300: '#96ADFA',
                400: '#7693F5',
                500: '#526ECC',
                600: '#465EB8',
                700: '#3C51A6',
                800: '#344899',
                900: '#2A3C85',
            },
            sky: {
                DEFAULT: '#6CBFFF',
                50: '#EBF6FF',
                100: '#D1EBFF',
                200: '#B8E0FF',
                300: '#9ED5FF',
                400: '#85CAFF',
                500: '#4EA6E6',
                600: '#3590CC',
                700: '#207AB3',
                800: '#0F6999',
                900: '#035880',
            },
            green: {
                DEFAULT: '#50D4AB',
                50: '#EDFFF9',
                100: '#CFFCEE',
                200: '#ACF2DC',
                300: '#8BE8CB',
                400: '#6DDEBB',
                500: '#3AC295',
                600: '#27B080',
                700: '#169E6C',
                800: '#088C58',
                900: '#007A45',
            },
            lime: {
                DEFAULT: '#A6DD82',
                50: '#F0FFE6',
                100: '#E5FFD4',
                200: '#D8FCC0',
                300: '#C5F2A7',
                400: '#B3E890',
                500: '#92CC68',
                600: '#7EBA50',
                700: '#6CA83B',
                800: '#5E9629',
                900: '#518519',
            },
            yellow: {
                DEFAULT: '#FAC20A',
                50: '#FFFBF0',
                100: '#FFF1C2',
                200: '#FFE794',
                300: '#FFDC66',
                400: '#FFD138',
                500: '#E3AA00',
                600: '#CC9600',
                700: '#B58200',
                800: '#9E6F00',
                900: '#875C00',
            },
            orange: {
                DEFAULT: '#FA9841',
                50: '#FFF3E8',
                100: '#FFE1C7',
                200: '#FFD0A6',
                300: '#FFBF85',
                400: '#FFAD63',
                500: '#E37D29',
                600: '#CC6414',
                700: '#B54E04',
                800: '#9E3F00',
                900: '#873400',
            },
            red: {
                DEFAULT: '#F66F6A',
                50: '#FFEEED',
                100: '#FFD5D4',
                200: '#FFBCBA',
                300: '#FFA4A1',
                400: '#FF8B87',
                500: '#DE504E',
                600: '#C73636',
                700: '#B02121',
                800: '#991111',
                900: '#820404',
            },
            magente: {
                DEFAULT: '#F3689A',
                50: '#FFEDF3',
                100: '#FFD4E3',
                200: '#FFBAD2',
                300: '#FFA1C2',
                400: '#FC86B0',
                500: '#DB4D83',
                600: '#C4356E',
                700: '#AD215B',
                800: '#96114D',
                900: '#800440',
            },
            purple: {
                DEFAULT: '#A97AF8',
                50: '#F5F0FF',
                100: '#E7D9FF',
                200: '#DBC2FF',
                300: '#CAABFF',
                400: '#BC94FF',
                500: '#8A5CE0',
                600: '#6F42C9',
                700: '#572DB3',
                800: '#3F1A9C',
                900: '#2A0C85',
            },
        },
        borderRadius: {
            none: '0px',
            DEFAULT: '2px',
            feedback: '4px',
            card: '6px',
            full: '9999px',
        },
        zIndex: {
            framework: '1000',
            overlay: '1100',
            model: '1200',
            drawer: '1300',
            dropdown: '1400',
            toast: '1500',
        },
        fontSize: {
            base: ['14px', { lineHeight: '20px' }],
            xs: ['12px', { lineHeight: '18px' }],
            sm: ['12px', { lineHeight: '18px' }],
            md: ['14px', { lineHeight: '20px' }],
            lg: ['14px', { lineHeight: '20px' }],
            xl: ['16px', { lineHeight: '24px' }],
            '2xl': ['20px', { lineHeight: '28px' }],
            title: {
                card: ['16px', { lineHeight: '24px' }],
                model: ['16px', { lineHeight: '24px' }],
                overview: ['18px', { lineHeight: '36px' }],
            },
        },
        textColor: ({ theme }) => ({
            ...theme('colors'),
            primary: {
                DEFAULT: '#252B3A',
                dark: '#F5F5F5',
            },
            secondary: {
                DEFAULT: '#575D6C',
                dark: '#C1C1C1',
            },
            helper: {
                DEFAULT: '#BABBC0',
                dark: '#909090',
            },
            placeholder: {
                DEFAULT: '#8A8E99',
                dark: '#949494',
            },
            disabled: {
                DEFAULT: '#CFD0D3',
                dark: '#7D7D7D',
            },
            brand: theme('colors').blue,
        }),
        borderColor: ({ theme }) => ({
            ...theme('colors'),
            DEFAULT: '#F2F2F3',
            dark: '#505153',
            divider: {
                DEFAULT: '#DFE1E6',
                dark: '#3D3E40',
            },
        }),
        backgroundColor: ({ theme }) => ({
            ...theme('colors'),
            base: '#f3f6f8',
            dark: '#2E2F31',
            content: {
                DEFAULT: '#FFFFFF',
                dark: '#222222'
            },
        }),
    },
    plugins: [
        plugin(function ({ matchUtilities, addBase, theme }) {

            addBase({
                ':root': {
                    '--sw-font-size-base': theme('fontSize.base'),
                    '--sw-text-color-base': theme('textColor.primary'),
                }
            });

            matchUtilities(
                {
                    'safe-pb': (value) => ({
                        paddingBottom: `calc(${value} + env(safe-area-inset-bottom))`,
                    }),
                },
                {
                    values: theme('spacing')
                }
            );

        }),
    ],
}
