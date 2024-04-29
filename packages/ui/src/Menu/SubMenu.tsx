import React, { startTransition, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { renderItem, type MenuItem, MenuContext } from './Menu';
import { MenuItemProps, renderMenuTitle } from './MenuItem';
import { getClassNames } from '../utils/getClassNames';
import { ArrowIcon } from '@swai/icon';

export interface SubMenuProps extends MenuItemProps {}

const SubMenu: React.FC<SubMenuProps> = (props) => {
    const { level = 0, menu } = props;

    const { defaultOpen = true, activeName, setActiveName, onOpen, renderSubMenuTitle } = useContext(MenuContext);

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
        <div className={getClassNames('submenu', props.className)}>
            <div
                className={getClassNames('submenu__title', 'relative')}
                onClick={renderSubMenuTitle ? undefined : toggleOpen}
            >
                {renderSubMenuTitle ? (
                    renderSubMenuTitle(menu, level, open, activeName || '', {
                        toggleOpen,
                        setActiveName,
                    })
                ) : (
                    <>
                        {renderMenuTitle(menu, level)}
                        <span className="absolute top-1/2 right-4 -translate-y-1/2">
                            <ArrowIcon direction={open ? 'left' : 'right'} size={18} className="text-gray" />
                        </span>
                    </>
                )}
            </div>
            <div
                className={`overflow-hidden duration-200 transition-[all] ${open ? 'mt-1.5' : ''}`}
                style={{
                    height: contentHeight,
                }}
                onTransitionEnd={onTransationEnd}
            >
                <div ref={contentRef} role="menu">
                    {menu.children!.map((child) => renderItem(child, level + 1))}
                </div>
            </div>
        </div>
    );
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
