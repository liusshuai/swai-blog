'use client';
import Menu, { MenuProps } from './Menu';
import MenuItem, { MenuItemProps } from './MenuItem';
import SubMenu, { SubMenuProps } from './SubMenu';

(Menu as any).Item = MenuItem;
(Menu as any).SubMenu = SubMenu;
export default Menu as React.FC<MenuProps> & {
    Item: React.FC<MenuItemProps>;
    SubMenu: React.FC<SubMenuProps>;
};

export * from './Menu';
