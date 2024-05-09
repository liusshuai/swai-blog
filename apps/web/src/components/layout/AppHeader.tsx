'use client';
import React, { useEffect, useState } from 'react';
import { APP_THEME, Switch, useAppTheme } from '@swai/ui';
import { CloseIcon, MenuIcon, SearchIcon } from '@swai/icon';
import AppLogo from './AppLogo';
import AppNavs from './AppNavs';
import AppSearchBar from './AppSearchBar';
import { Drawer } from '@swai/ui';
import MobileSide from './MobileSide';
import { usePathname } from 'next/navigation';
import TouristAvatar from '../common/TouristAvatar';
import TouristFormDialog from '../common/TouristFormDialog';

export default function AppHeader() {
    const pathname = usePathname();
    const { theme, updateTheme } = useAppTheme();

    function onModeChange(value: boolean) {
        updateTheme(value ? APP_THEME.Dark : APP_THEME.Light);
    }
    const [openMenu, setOpenMenu] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    useEffect(() => {
        setOpenMenu(false);
    }, [pathname]);

    return (
        <header className="bg-[#282B33] text-white shadow-sm h-nav sticky top-0 z-framework tablet:rounded-b-card dark:bg-[#222222]">
            <div className="container flex items-center justify-between h-full">
                <MenuIcon className="tablet:hidden" onClick={() => setOpenMenu(true)} />
                <AppLogo />
                <span role="button" className="tablet:hidden" onClick={() => setOpenSearch(!openSearch)}>
                    {openSearch ? <CloseIcon /> : <SearchIcon />}
                </span>
                <div className="mobile:hidden flex items-center">
                    <AppNavs />
                    <AppSearchBar />
                    <Switch
                        className="mx-5"
                        value={theme === APP_THEME.Dark}
                        activeText="浅色"
                        inactiveText="深色"
                        onChange={onModeChange}
                    />
                    <TouristAvatar />
                </div>
            </div>
            {openSearch ? (
                <div className="bg-[#282B33] sticky top-nav py-2 px-4 z-nav tablet:hidden">
                    <AppSearchBar afterSearch={() => setOpenSearch(false)} />
                </div>
            ) : null}

            <Drawer className="tablet:hidden" open={openMenu} title={<span></span>} onClose={() => setOpenMenu(false)}>
                <MobileSide />
            </Drawer>

            <TouristFormDialog />
        </header>
    );
}
