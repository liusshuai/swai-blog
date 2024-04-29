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
export function renderMenuTitle(menu: MenuItem, level = 0, active = false) {
    const classes = classNames('py-2.5 px-4 cursor-pointer transation-all duration-150 rounded-feedback select-none', [
        active ? 'font-semibold text-white bg-primary' : [DEFAULT_ITEM_CLASSES, DARK_ITEM_CLASSES],
    ]);
    const style = useMemo<any>(
        () => ({
            paddingInlineStart: 16 + 16 * level + 'px',
        }),
        [level],
    );

    return (
        <div className={classes} style={style}>
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
            {renderItem ? renderItem(menu, level, isActive) : renderMenuTitle(menu, level, isActive)}
        </div>
    );
};

MenuItem.displayName = 'MenuItem';
export default MenuItem;
