import React, { useContext, useMemo } from 'react';
import { MenuContext, MenuItem } from './Menu';
import { getClassNames } from '../utils/getClassNames';
import classNames from 'classnames';

export interface MenuItemProps {
    level: number;
    menu: MenuItem;
    className?: string;
}

const DEFAULT_ITEM_CLASSES = 'text-primary tablet:hover:text-brand tablet:hover:bg-gray-50';
const DARK_ITEM_CLASSES = 'dark:text-primary-dark tablet:dark:hover:bg-blue-100';
const MENU_ITEM_COMMON_CLASSES = 'cursor-pointer transation-all duration-150 select-none flex items-center gap-3';

export const MENUITEM_CLASSES = classNames('py-3 px-4 rounded-feedback', MENU_ITEM_COMMON_CLASSES);
export const MENUITEM_ACTIVE_CLASSES = 'font-semibold text-white bg-primary';
export const MENUITEM_INACTIVE_CLASSES = classNames([DEFAULT_ITEM_CLASSES, DARK_ITEM_CLASSES]);

export function renderMenuTitle(menu: MenuItem, level = 0, active = false) {
    const { popupSubMenu } = useContext(MenuContext);

    const classes = classNames(MENUITEM_CLASSES, [active ? MENUITEM_ACTIVE_CLASSES : MENUITEM_INACTIVE_CLASSES], {
        'rounded-none': popupSubMenu && level > 0,
    });
    const style = useMemo<any>(
        () => ({
            paddingInlineStart: 16 + (popupSubMenu ? 0 : 16 * level) + 'px',
        }),
        [level],
    );

    return (
        <div className={classes} style={style}>
            {menu.icon}
            <span className="text-md">{menu.label}</span>
        </div>
    );
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
    const { level = 0, menu } = props;

    const { activeName, setActiveName, onSelect, renderItem } = useContext(MenuContext);

    const isActive = useMemo(() => activeName === menu.name, [activeName, menu]);

    function onClick() {
        onSelect && onSelect(menu.name);
        setActiveName(menu.name);
    }

    return (
        <div className={getClassNames('menu-item', props.className)} role="menuitem" onClick={onClick}>
            {(renderItem ? renderItem : renderMenuTitle)(menu, level, isActive)}
        </div>
    );
};

MenuItem.displayName = 'MenuItem';
export default MenuItem;
