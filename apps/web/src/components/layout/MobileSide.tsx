import { APP_THEME, Switch, useAppTheme } from '@swai/ui';
import UserData from '../common/UserData';
import AppNavs from './AppNavs';

export default function MobileSide() {
    const { theme, updateTheme } = useAppTheme();

    function onModeChange(value: boolean) {
        updateTheme(value ? APP_THEME.Dark : APP_THEME.Light);
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div>
                <UserData />
                <AppNavs />
            </div>
            <div className="flex items-center px-2.5 pb-5">
                <span className="text-primary dark:text-primary-dark me-5">深色模式:</span>
                <Switch value={theme === APP_THEME.Dark} activeText="关" inactiveText="开" onChange={onModeChange} />
            </div>
        </div>
    );
}
