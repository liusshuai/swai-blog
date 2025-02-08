import { ReactNode, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import authStore from '../store/useAuthStore';
import PageLoading from '../components/layout/PageLazyLoad/PageLoading';

const RequireAuth = observer(({ store, children }: { store: typeof authStore; children: ReactNode }) => {
    const location = useLocation();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!store.state.userInfo) {
            setLoading(true);
            store.getUserInfo().finally(() => {
                setLoading(false);
            });
        }
    }, []);

    if (loading) {
        return <PageLoading />;
    }

    if (!store.state.userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
});

export default ({ children }: { children: ReactNode }) => <RequireAuth store={authStore}>{children}</RequireAuth>;
