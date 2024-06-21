import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface RouteMeta {
    name?: string;
    parentNodes: {
        name: string;
        path?: string;
    }[];
}
export const routeMeta = Object.freeze<Record<string, RouteMeta>>({
    '/dashboard': {
        name: 'Dashboard',
        parentNodes: [
            {
                name: 'Dashboard',
            },
        ],
    },
    '/docs': {
        name: '文章列表',
        parentNodes: [
            {
                name: '文章管理',
            },
            {
                name: '文章列表',
            },
        ],
    },
    '/comments': {
        name: '评论列表',
        parentNodes: [
            {
                name: '评论管理',
            },
            {
                name: '评论列表',
            },
        ],
    },
    '/messages': {
        name: '留言板',
        parentNodes: [
            {
                name: '评论管理',
            },
            {
                name: '留言板',
            },
        ],
    },
    '/followers': {
        name: '用户列表',
        parentNodes: [
            {
                name: '用户管理',
            },
            {
                name: '用户列表',
            },
        ],
    },
});

export function useRouteMeta() {
    const location = useLocation();

    const currentRouteMeta = useMemo<RouteMeta | null>(() => {
        return routeMeta[location.pathname] || null;
    }, [location.pathname]);

    return currentRouteMeta;
}
