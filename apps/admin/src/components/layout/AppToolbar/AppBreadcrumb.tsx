import { Breadcrumb } from '@swai/ui';

export default () => {
    return (
        <div className="py-3">
            <Breadcrumb
                source={[
                    {
                        name: '首页',
                        path: '/',
                    },
                    {
                        name: '工作台',
                        path: '/dashboard',
                    },
                ]}
            />
        </div>
    );
};
