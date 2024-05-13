import { APP_THEME, Switch, useAppTheme } from '@swai/ui';
import UserData from '../common/UserData';
import AppNavs from './AppNavs';
import { ArrowIcon } from '@swai/icon';
import { observer } from 'mobx-react-lite';
import touristStore from '@/store/touristStore';

const MobileSide = observer(({ tStore }: { tStore: typeof touristStore }) => {
    const { theme, updateTheme } = useAppTheme();

    function onModeChange(value: boolean) {
        updateTheme(value ? APP_THEME.Dark : APP_THEME.Light);
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div>
                <UserData />
                <AppNavs />
                <div className='mt-2.5 ps-4 pe-5 flex items-center justify-between' onClick={() => tStore.setEditDialogVisible(true)}>
                    <img className='w-8 h-8 rounded-full' src={tStore.touristAvatar.get()} alt='' />
                    <span className='inline-flex items-center text-secondary text-sm dark:text-secondary-dark'>
                        {tStore.state.profile ? tStore.state.profile.nickname : '编辑信息'}
                        <ArrowIcon size={18} />
                    </span>
                </div>
            </div>
            <div className="flex items-center shrink-0">
                <span className="text-primary dark:text-primary-dark me-5">深色模式:</span>
                <Switch value={theme === APP_THEME.Dark} activeText="关" inactiveText="开" onChange={onModeChange} />
            </div>
        </div>
    );
});

export default () => <MobileSide tStore={touristStore} />
