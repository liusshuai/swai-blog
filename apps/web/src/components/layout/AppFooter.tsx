import { Typography } from '@swai/ui';

export default function AppFooter() {
    return (
        <div className="py-8 text-center border-t dark:border-divider-dark">
            <Typography color="#ccc" className="text-xs tablet:text-sm">
                LSSHUAISL个人博客 -{' '}
                <a
                    className="cursor-pointer transition-colors hover:text-secondary hover:dark:text-secondary-dark"
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                >
                    渝ICP备2024030870号
                </a>
            </Typography>
        </div>
    );
}
