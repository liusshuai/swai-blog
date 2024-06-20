import { MenuFoldIcon, MenuUnFoldIcon } from '@swai/icon';
import React from 'react';

interface AppTooBarProps {
    menuFold?: boolean;
    toggleMenuFold?: () => void;
}

export default (props: AppTooBarProps) => {
    return (
        <div className="bg-white shrink-0 h-16 flex justify-between items-center px-4 pe-8">
            <div>
                {React.createElement(props.menuFold ? MenuUnFoldIcon : MenuFoldIcon, {
                    size: 22,
                    className: 'cursor-pointer',
                    onClick: props.toggleMenuFold,
                })}
            </div>
            <div className="flex items-center">
                <img
                    className="w-8 h-8 rounded-full me-2"
                    src="http://www.yangzicong.com/static/img/myhead.jpg"
                    alt=""
                ></img>
                <span>Cameron</span>
            </div>
        </div>
    );
};
