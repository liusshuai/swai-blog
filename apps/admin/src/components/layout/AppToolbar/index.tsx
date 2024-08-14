import { MenuFoldIcon, MenuUnFoldIcon } from '@swai/icon';
import React, { Key, useMemo } from 'react';
import { Breadcrumb, Dropdown } from '@swai/ui';
import { useRouteMeta } from '../../../router/useRouteMeta';
import { observer } from 'mobx-react-lite';
import authStore from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface AppTooBarProps {
    menuFold?: boolean;
    toggleMenuFold?: () => void;
}

const AppToolBar = observer(({ ...props }: AppTooBarProps & { store: typeof authStore }) => {
    const navigate = useNavigate();
    const currentRouteMeta = useRouteMeta();

    const routeParentNodes = useMemo(() => {
        if (currentRouteMeta?.parentNodes) {
            return currentRouteMeta.parentNodes;
        }

        return [];
    }, [currentRouteMeta]);
    const userInfo = useMemo(() => {
        return authStore.state.userInfo;
    }, [authStore.state.userInfo]);

    function onMenuClick(key: Key) {
        console.log(key);
        switch (key) {
            case 'logout':
                authStore.doLogout().then(() => {
                    navigate('/login', { replace: true });
                });
                break;
            default:
                break;
        }
    }

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
                <Dropdown
                    menus={[
                        {
                            label: '登出',
                            key: 'logout',
                        },
                    ]}
                    onMenuClick={onMenuClick}
                >
                    <div className="flex items-center">
                        <img
                            className="w-8 h-8 rounded-full me-2"
                            referrerPolicy="no-referrer"
                            src={userInfo?.avatar}
                            alt=""
                        ></img>
                        <span>{userInfo?.nickname}</span>
                    </div>
                </Dropdown>
            </div>
            {/* <AppBreadcrumb /> */}
        </div>
    );
});

export default (props: AppTooBarProps) => <AppToolBar {...props} store={authStore} />;
