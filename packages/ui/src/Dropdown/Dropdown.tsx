import React, { Key, ReactNode } from 'react';
import type { PopupProps } from '../Popup/Popup';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import Popup from '../Popup/Popup';

export interface DropdownMenu {
    key: string | number | Key;
    label: string;
    [key: string]: any;
}

export interface DropdownProps extends ComponentContext, Pick<PopupProps, 'trigger' | 'position' | 'show' | 'hide'> {
    menus?: DropdownMenu[];
    menuNode?: ReactNode;
    onMenuClick?: (key: DropdownMenu['key']) => void;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const classes = getClassNames('dropdown', props.className);

    return (
        <div className={classes}>
            <Popup
                trigger={props.trigger || 'hover'}
                position={props.position}
                content={
                    props.menuNode ? (
                        props.menuNode
                    ) : (
                        <ul className="shadow bg-white py-2">
                            {(props.menus || []).map((menu) => (
                                <li
                                    className="text-sm px-4 py-2 cursor-pointer border-b border-gray-50 last:border-b-0 hover:bg-blue-50"
                                    key={menu.key}
                                    onClick={() => (props.onMenuClick ? props.onMenuClick(menu.key) : undefined)}
                                >
                                    {menu.label}
                                </li>
                            ))}
                        </ul>
                    )
                }
                show={props.show}
                hide={props.hide}
            >
                {props.children}
            </Popup>
        </div>
    );
};

Dropdown.displayName = 'Dropdown';
export default Dropdown;
