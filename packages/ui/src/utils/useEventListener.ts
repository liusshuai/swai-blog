'use client';

import { useEffect } from 'react';
import { isBrowser } from './dom';

export type UseEventListenerOptions = {
    target?: EventTarget;
    capture?: boolean;
    passive?: boolean;
    deps?: any[];
};

export function useEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (event: DocumentEventMap[K]) => void,
    options?: UseEventListenerOptions,
): void;
export function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions): void;
export function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions) {
    if (!isBrowser) {
        return;
    }

    const { target = window, capture = false, passive = false, deps = [] } = options || {};

    const add = () => {
        target.addEventListener(type, listener, {
            passive,
            capture,
        });
    };

    const remove = () => {
        target.removeEventListener(type, listener, capture);
    };

    useEffect(() => {
        add();

        return remove;
    }, []);

    useEffect(() => {
        add();

        return remove;
    }, [target, ...deps]);
}
