import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import lazyload from '../components/layout/PageLazyLoad';

const Login = React.lazy(() => import('../pages/login'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const Docs = React.lazy(() => import('../pages/docs'));
const Comments = React.lazy(() => import('../pages/comments'));
const Messages = React.lazy(() => import('../pages/messages'));
const Followers = React.lazy(() => import('../pages/followers'));

export default createBrowserRouter([
    {
        path: '/',
        element: <App />,
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
                path: '/messages',
                element: lazyload(<Messages />),
            },
            {
                path: '/followers',
                element: lazyload(<Followers />),
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
]);
