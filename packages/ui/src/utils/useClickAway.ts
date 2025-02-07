'use client';
import { isBrowser } from './dom';
import { useEventListener } from './useEventListener';
type UseClickAwayOptions = {
    eventName: string;
};

export default function useClickAway(
    target: Element | (Element | undefined | null)[],
    listener: EventListener,
    options?: UseClickAwayOptions,
) {
    if (!isBrowser) {
        return;
    }

    const eventName = options?.eventName || 'click';

    const onClick = (evt: Event) => {
        const targets = Array.isArray(target) ? target : [target];
        const isClickaway = targets.every((elm) => {
            return elm && !elm.contains(evt.target as Node);
        });

        if (isClickaway) {
            listener(evt);
        }
    };

    useEventListener(eventName, onClick, { target: document, deps: [target] });
}
