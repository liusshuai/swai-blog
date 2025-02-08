import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import lazyload from '../components/layout/PageLazyLoad';
import RequireAuth from './RequireAuth';

const Login = React.lazy(() => import('../pages/login'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const Docs = React.lazy(() => import('../pages/docs'));
const Comments = React.lazy(() => import('../pages/comments'));
const Followers = React.lazy(() => import('../pages/followers'));
const MailRecords = React.lazy(() => import('../pages/mail-records'));

export default createBrowserRouter([
    {
        path: '/',
        element: (
            <RequireAuth>
                <App />
            </RequireAuth>
        ),
        errorElement: <p>you got some errors!</p>,
        children: [
            {
                path: '/dashboard',
                element: lazyload(<Dashboard />),
            },
            {
                path: '/docs',
                element: lazyload(<Docs />),
            },
            {
                path: '/comments',
                element: lazyload(<Comments />),
            },
            {
                path: '/followers',
                element: lazyload(<Followers />),
            },
            {
                path: '/mail-records',
                element: lazyload(<MailRecords />),
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
]);
