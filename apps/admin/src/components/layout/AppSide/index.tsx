import logo from '@/assets/images/logo_white.png';
import logoShort from '@/assets/images/logo_short.png';
import { AppSideBar } from '@swai/ui';
import { CommentIcon, DataScreenIcon, DocSearchIcon, PeoplesIcon, MailSearchIcon } from '@swai/icon';
import type { MenuItem } from '@swai/ui/lib/Menu';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppSideProps {
    className?: string;
    menuFold?: boolean;
}
export default (props: AppSideProps) => {
    const { menuFold } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const menus = useRef<MenuItem[]>([
        {
            icon: <DataScreenIcon size={18} />,
            label: 'Dashboard',
            name: 'dashboard',
        },
        {
            icon: <DocSearchIcon size={18} />,
            label: '文章管理',
            name: 'doc',
            children: [
                {
                    label: '文章列表',
                    name: 'docs',
                },
            ],
        },
        {
            icon: <CommentIcon size={18} />,
            label: '评论管理',
            name: 'comment',
            children: [
                {
                    label: '评论列表',
                    name: 'comments',
                },
            ],
        },
        {
            icon: <PeoplesIcon size={18} />,
            label: '用户管理',
            name: 'follower',
            children: [
                {
                    label: '用户列表',
                    name: 'followers',
                },
            ],
        },
        {
            icon: <MailSearchIcon size={18} />,
            label: '邮件管理',
            name: 'mails',
            children: [
                {
                    label: '发送记录',
                    name: 'mail-records',
                },
            ],
        },
    ]);

    const currentMenu = useMemo(() => {
        return location.pathname.replace('/', '');
    }, [location.pathname]);

    function onMenuSelect(name: string) {
        navigate('/' + name);
    }

    return (
        <AppSideBar
            className="shrink-0"
            theme="dark"
            fold={menuFold}
            head={<img className={`w-full h-full object-contain`} src={menuFold ? logoShort : logo} alt="LSSHUAISL" />}
            menus={menus.current}
            activeMenu={currentMenu}
            onMenuSelect={onMenuSelect}
        />
    );
};
