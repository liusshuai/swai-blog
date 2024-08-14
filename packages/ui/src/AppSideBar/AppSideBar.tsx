'use client';
import React, { ReactNode, startTransition, useEffect, useMemo, useState } from 'react';
import type { Theme } from '../types/ComponentTypes';
import type { MenuItem } from '../Menu';
import { getClassNames } from '../utils/getClassNames';
import Menu from '../Menu';
import { MENUITEM_ACTIVE_CLASSES, MENUITEM_CLASSES, MENUITEM_INACTIVE_CLASSES } from '../Menu/MenuItem';
import { renderSubMenuTitle as _renderSubMenuTitle, renderArrow } from '../Menu/SubMenu';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

export interface AppSideBarProps {
    theme?: Theme;
    head?: React.ReactNode;
    foot?: React.ReactNode;
    menus?: MenuItem[];
    activeMenu?: string;
    fold?: boolean;
    className?: string;

    onMenuSelect?: (name: string) => void;
}

const AppSideBar: React.FC<AppSideBarProps> = (props) => {
    const { theme = 'light', activeMenu = '', fold = false, menus = [] } = props;

    const [collapsed, setCollapsed] = useState(fold);

    useEffect(() => {
        if (fold) {
            setCollapsed(true);
        }
    }, [fold]);

    const classes = useMemo(
        () =>
            getClassNames(
                'app-side-bar',
                'h-full px-2.5 bg-content dark:bg-content-dark',
                'transition-all duration-200',
                [fold ? 'w-20' : 'w-64'],
                props.className,
            ),
        [fold],
    );

    function onTransitionEnd() {
        startTransition(() => {
            setCollapsed(fold);
        });
    }

    function renderItem(menu: MenuItem, level: number, active: boolean) {
        const classes = classNames(MENUITEM_CLASSES, [active ? MENUITEM_ACTIVE_CLASSES : MENUITEM_INACTIVE_CLASSES], {
            'rounded-none': collapsed && level > 0,
        });
        const style = useMemo<any>(
            () => ({
                paddingInlineStart: 16 + (collapsed ? 0 : 16 * level) + 'px',
            }),
            [level, collapsed],
        );

        const wrap = (children: ReactNode) => {
            return (
                <div className={classes} style={style}>
                    {children}
                </div>
            );
        };

        if (collapsed && level === 0) {
            if (!menu.children || menu.children.length === 0) {
                return (
                    <Tooltip position="right" content={menu.label} space={15} anchorClasses="!block">
                        {wrap(menu.icon ? <span className="shrink-0">{menu.icon}</span> : null)}
                    </Tooltip>
                );
            }
            return wrap(menu.icon ? <span className="shrink-0">{menu.icon}</span> : null);
        }

        return wrap(
            <>
                {menu.icon ? <span className="shrink-0">{menu.icon}</span> : null}
                <span className="'text-md'">{menu.label}</span>
            </>,
        );
    }

    function renderSubMenuTitle(menu: MenuItem, level: number, open: boolean, activeName: string, { toggleOpen }: any) {
        return (
            <div onClick={toggleOpen}>
                {renderItem(menu, level, activeName === menu.name)}
                {collapsed && level === 0 ? null : (
                    <span className="absolute top-1/2 right-4 -translate-y-1/2">{renderArrow(open, collapsed)}</span>
                )}
            </div>
        );
    }

    return (
        <div data-theme={theme} className={classes} onTransitionEnd={onTransitionEnd}>
            <div className="flex flex-col h-full">
                <div className="grow">
                    <div className={getClassNames('app-side-bar__head', 'h-16 py-2.5')}>{props.head}</div>
                    <div className={getClassNames('app-side-bar__menus', 'min-h-16 my-5')}>
                        <Menu
                            theme={theme}
                            menus={menus}
                            popupSubMenu={collapsed}
                            activeName={activeMenu}
                            onSelect={props.onMenuSelect}
                            renderItem={renderItem}
                            renderSubMenuTitle={renderSubMenuTitle}
                        />
                    </div>
                </div>
                {props.foot ? (
                    <div className={getClassNames('app-side-bar__foot', 'shrink py-5')}>{props.foot}</div>
                ) : null}
            </div>
        </div>
    );
};

AppSideBar.displayName = 'AppSideBar';
export default AppSideBar;
