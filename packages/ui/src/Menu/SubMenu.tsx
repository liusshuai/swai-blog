import React, { forwardRef, startTransition, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { renderItem, MenuContext, MenuItem } from './Menu';
import { MenuItemProps, renderMenuTitle } from './MenuItem';
import { getClassNames } from '../utils/getClassNames';
import { ArrowIcon } from '@swai/icon';
import Popup from '../Popup';

export interface SubMenuProps extends MenuItemProps {}

interface SubMenuTitleProps {
    level: number;
    menu: MenuItem;
    open: boolean;

    toggleOpen?: () => void;
}

export function renderArrow(open: boolean, popupSubMenu: boolean = false) {
    let direction: 'left' | 'right' | 'up' | 'down' = open ? 'left' : 'right';
    if (popupSubMenu) {
        direction = open ? 'down' : 'up';
    }

    return <ArrowIcon direction={direction} size={18} className="text-gray" />;
}

export function renderSubMenuTitle(menu: MenuItem, level: number, open: boolean) {
    const { popupSubMenu } = useContext(MenuContext);

    return (
        <>
            {renderMenuTitle(menu, level)}
            <span className="absolute top-1/2 right-4 -translate-y-1/2">{renderArrow(open, popupSubMenu)}</span>
        </>
    );
}

const SubMenuTitle = (props: SubMenuTitleProps) => {
    const { level = 0, menu, open, toggleOpen } = props;

    const { activeName, setActiveName, renderSubMenuTitle: _renderTitle } = useContext(MenuContext);

    function renderTitle() {
        return _renderTitle
            ? _renderTitle(menu, level, open, activeName || '', {
                  toggleOpen,
                  setActiveName,
              })
            : renderSubMenuTitle(menu, level, open);
    }

    return (
        <div className={getClassNames('submenu__title', 'relative')} onClick={_renderTitle ? undefined : toggleOpen}>
            {renderTitle()}
        </div>
    );
};

const SubMenuChildren = forwardRef<HTMLDivElement, { menu: MenuItem; level: number }>(({ menu, level }, ref) => {
    return (
        <div ref={ref} role="menu">
            {menu.children!.map((child) => renderItem(child, level + 1))}
        </div>
    );
});

const UnFoldSubMenu = (props: SubMenuProps) => {
    const { level = 0, menu } = props;

    const { defaultOpen = true, onOpen } = useContext(MenuContext);

    const contentRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [contentHeight, setContentHeight] = useState('auto');

    function onTransationEnd() {
        if (contentHeight !== '0') {
            startTransition(() => {
                setContentHeight('auto');
            });
        }
    }

    function getContentHeight() {
        if (contentRef.current) {
            return (contentRef.current as HTMLDialogElement).offsetHeight + 'px';
        }

        return '0';
    }

    function toggleOpen(e?: any) {
        e && e.stopPropagation();
        if (open) {
            setContentHeight(getContentHeight());
        }
        const nextOpenState = !open;
        startTransition(() => {
            setOpen(nextOpenState);
            if (nextOpenState) {
                setContentHeight(getContentHeight());
            } else {
                setContentHeight('0');
            }
        });
    }

    useLayoutEffect(() => {
        if (!defaultOpen) {
            setOpen(false);
            setContentHeight('0');
        }
    }, [defaultOpen]);

    useEffect(() => {
        if (open) {
            onOpen && onOpen(menu.name);
        }
    }, [open]);

    return (
        <>
            <SubMenuTitle menu={menu} level={level} open={open} toggleOpen={toggleOpen} />
            <div
                className={`overflow-hidden duration-200 transition-[all] ${open ? 'mt-1.5' : ''}`}
                style={{
                    height: contentHeight,
                }}
                onTransitionEnd={onTransationEnd}
            >
                <SubMenuChildren ref={contentRef} menu={menu} level={level} />
            </div>
        </>
    );
};

const FoldSubMenu = (props: SubMenuProps) => {
    const { menu, level } = props;

    const { theme } = useContext(MenuContext);

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popup
            trigger="hover"
            position="right-top"
            space={level === 0 ? 15 : 5}
            content={
                <div
                    data-theme={theme}
                    className="py-1 bg-content rounded w-56 shadow overflow-hidden dark:bg-content-dark"
                >
                    <SubMenuChildren menu={menu} level={level} />
                </div>
            }
            anchorClasses="!block"
            show={() => setOpen(true)}
            hide={() => setOpen(false)}
        >
            <SubMenuTitle menu={menu} level={level} open={open} />
        </Popup>
    );
};

const SubMenu: React.FC<SubMenuProps> = (props) => {
    const { popupSubMenu } = useContext(MenuContext);

    const { level = 0, menu } = props;

    return (
        <div className={getClassNames('submenu', props.className)}>
            {React.createElement(popupSubMenu ? FoldSubMenu : UnFoldSubMenu, {
                level,
                menu,
            })}
        </div>
    );
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
