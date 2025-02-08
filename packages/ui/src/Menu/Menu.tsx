'use client';
import React, { createContext, useEffect, useState } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import Item from './MenuItem';
import SubMenu from './SubMenu';
import { getClassNames } from '../utils/getClassNames';
import { Theme } from '../types/ComponentTypes';

export interface MenuItem {
    icon?: React.ReactNode;
    label: string;
    name: string;
    children?: MenuItem[];
}

type SetActiveFunc = (name: string) => void;
export interface MenuEmitors {
    onSelect?: (name: string) => void;
    onOpen?: (name: string) => void;
    renderItem?: (menu: MenuItem, level: number, active: boolean) => React.ReactNode;
    renderSubMenuTitle?: (
        menu: MenuItem,
        level: number,
        open: boolean,
        activeName: string,
        emitors: {
            toggleOpen?: () => void;
            setActiveName: SetActiveFunc;
        },
    ) => React.ReactNode;
}

export interface MenuProps extends MenuEmitors, Omit<ComponentContext, 'children'> {
    menus: MenuItem[];
    defaultOpen?: boolean;
    activeName?: string;
    popupSubMenu?: boolean;
    theme?: Theme;
}

interface MenuContextOptions extends MenuEmitors {
    activeName?: string;
    defaultOpen?: boolean;
    popupSubMenu?: boolean;
    theme?: Theme;

    setActiveName: SetActiveFunc;
}

export const MenuContext = createContext<MenuContextOptions>({
    setActiveName: (name) => {},
});

export function renderItem(menu: MenuItem, level = 0) {
    return React.createElement(menu.children && menu.children.length > 0 ? SubMenu : Item, {
        key: menu.name,
        menu,
        level,
        className: 'mb-1.5 last:mb-0',
    });
}

const Menu: React.FC<MenuProps> = (props) => {
    const {
        menus = [],
        defaultOpen = true,
        popupSubMenu = false,
        theme = 'light',
        className,
        style,
        ...extraProps
    } = props;

    const classes = getClassNames('menu', className);

    const [activeName, setActiveName] = useState(props.activeName || '');

    useEffect(() => {
        setActiveName(props.activeName || '');
    }, [props.activeName]);

    return (
        <div data-theme={theme} className={classes} role="menu" style={style}>
            <MenuContext.Provider
                value={{ activeName, defaultOpen, popupSubMenu, theme, setActiveName, ...extraProps }}
            >
                {(menus || []).map((menu) => renderItem(menu))}
            </MenuContext.Provider>
        </div>
    );
};

Menu.displayName = 'Menu';
export default Menu;
