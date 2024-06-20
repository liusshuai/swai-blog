import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

const Login = React.lazy(() => import('../pages/login'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const Docs = React.lazy(() => import('../pages/docs'));

export default createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <p>you got some errors!</p>,
        children: [
            {
                path: '/dashboard',
                element: (
                    <React.Suspense fallback={<p>Loading...</p>}>
                        <Dashboard />
                    </React.Suspense>
                ),
            },
            {
                path: '/docs',
                element: (
                    <React.Suspense fallback={<p>Loading...</p>}>
                        <Docs />
                    </React.Suspense>
                ),
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
]);
