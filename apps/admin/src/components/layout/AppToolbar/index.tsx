import { MenuFoldIcon, MenuUnFoldIcon } from '@swai/icon';
import React, { useEffect, useMemo } from 'react';
import { Breadcrumb } from '@swai/ui';
import { useRouteMeta } from '../../../router/useRouteMeta';

interface AppTooBarProps {
    menuFold?: boolean;
    toggleMenuFold?: () => void;
}

export default (props: AppTooBarProps) => {
    const currentRouteMeta = useRouteMeta();

    const routeParentNodes = useMemo(() => {
        if (currentRouteMeta?.parentNodes) {
            return currentRouteMeta.parentNodes;
        }

        return [];
    }, [currentRouteMeta]);

    return (
        <div className="bg-white shrink-0 px-4 pe-8 shadow-[0_3px_8px_rgba(0,0,0,1)]">
            <div className="h-16 flex justify-between items-center border-b">
                <div className="flex items-center">
                    {React.createElement(props.menuFold ? MenuUnFoldIcon : MenuFoldIcon, {
                        size: 22,
                        className: 'cursor-pointer',
                        onClick: props.toggleMenuFold,
                    })}
                    <Breadcrumb className="ms-10" source={routeParentNodes} />
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
            {/* <AppBreadcrumb /> */}
        </div>
    );
};
