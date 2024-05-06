'use client';

import { useEffect, useState } from 'react';

export const APP_THEME_KEY = 'SW_APP_THEME';
export const APP_THEME = Object.freeze({
    Light: 'Light',
    Dark: 'Dark',
});
type APP_THEME = keyof typeof APP_THEME;
export default function useAppTheme() {
    const [theme, setTheme] = useState<APP_THEME>();

    useEffect(() => {
        const local = getThemeFromLocal(APP_THEME_KEY);
        updateTheme(local);
    }, []);

    function updateTheme(theme: APP_THEME) {
        const html = document.documentElement;
        if (theme === APP_THEME.Dark) {
            html.dataset.theme = 'dark';
        } else {
            html.removeAttribute('data-theme');
        }
        setTheme(theme);
        setThemeToLocal(APP_THEME_KEY, theme);
    }

    return {
        theme,
        updateTheme,
    };
}

function getThemeFromSystem() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? APP_THEME.Dark : APP_THEME.Light; 
}

function getThemeFromLocal(key: string) {
    const local = localStorage.getItem(key);
    return (local || getThemeFromSystem()) as APP_THEME;
}

function setThemeToLocal(key: string, theme: keyof typeof APP_THEME) {
    localStorage.setItem(key, theme);
}
