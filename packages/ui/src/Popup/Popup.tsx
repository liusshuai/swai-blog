'use client';

import React, {
    CSSProperties,
    forwardRef,
    startTransition,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { throttle } from 'lodash-es';
import { getClassNames } from '../utils/getClassNames';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import { isScrollable, onElementSizeChange } from '../utils/dom';

export type PopupPosition =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'left-top'
    | 'left-bottom'
    | 'right'
    | 'right-top'
    | 'right-bottom';
export interface PopupProps {
    classNames?: string;
    children: React.ReactNode;
    content: React.ReactNode;
    position?: PopupPosition;
    trigger?: 'hover' | 'click' | 'manual';
    space?: number;
    duration?: number;
    anchorClasses?: string;
    disabled?: boolean;
    show?: () => void;
    hide?: () => void;
}

export interface PopupRef {
    open: () => void;
    close: () => void;
}

const Popup = forwardRef<PopupRef, PopupProps>((props, ref) => {
    const { disabled, position = 'bottom', trigger = 'click', space = 10, duration = 150, anchorClasses } = props;

    const anchorRef = useRef<HTMLSpanElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);

    const [contentStyle, setContentStyle] = useState<CSSProperties>({});
    const [transitionStateStyle, setTransitionStateStyle] = useState<Record<string, CSSProperties>>({});

    function updateContentStyle() {
        startTransition(() => {
            if (anchorRef.current && contentRef.current) {
                const realPosition = getRealPosition(anchorRef.current, contentRef.current, position, space);
                setContentStyle({ ...getDefaultStyle(anchorRef.current, contentRef.current, realPosition) });
                setTransitionStateStyle({ ...getTransitionStyle(realPosition, space) });
            }
        });
    }

    useImperativeHandle(ref, () => {
        return {
            open: () => {
                setOpen(true);
            },
            close: () => {
                setOpen(false);
            },
        };
    });

    useLayoutEffect(updateContentStyle, [contentRef.current, anchorRef.current, space]);

    useEffect(() => {
        let el = anchorRef.current?.parentElement || null;
        const scrollableEls: HTMLElement[] = [];

        const update = throttle(updateContentStyle, 200);

        while (el !== null) {
            if (isScrollable(el)) {
                scrollableEls.push(el);
                el.addEventListener('scroll', update);
            }
            el = el.parentElement;
        }

        return () => {
            scrollableEls.forEach((el) => {
                el.removeEventListener('scroll', update);
            });
        };
    }, [anchorRef.current]);

    useEffect(() => {
        const update = throttle(updateContentStyle, 200);
        const disconnect = onElementSizeChange(anchorRef.current, update);

        return disconnect;
    }, []);

    useEffect(() => {
        const effect = () => setOpen(false);

        if (trigger === 'click') {
            window.addEventListener('click', effect);

            return () => {
                window.removeEventListener('click', effect);
            };
        } else {
            window.removeEventListener('click', effect);
        }
    }, [trigger]);

    useEffect(() => {
        if (open) {
            updateContentStyle();
            props.show && props.show();
        } else {
            props.hide && props.hide();
        }
    }, [open]);

    function onClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        setOpen(!open);
    }

    function onMouseOver() {
        setOpen(true);
    }

    function onMouseLeave() {
        setOpen(false);
    }

    return (
        <>
            <span
                ref={anchorRef}
                className={getClassNames('popup__anchor', 'inline-block', anchorClasses)}
                onClick={!disabled && trigger === 'click' ? onClick : undefined}
                onMouseOver={!disabled && trigger === 'hover' ? onMouseOver : undefined}
                onMouseLeave={!disabled && trigger === 'hover' ? onMouseLeave : undefined}
            >
                {props.children}
            </span>

            {createPortal(
                <Transition nodeRef={contentRef} in={open} timeout={duration} appear unmountOnExit>
                    {(state) => (
                        <div
                            ref={contentRef}
                            className="fixed transition-all z-dropdown"
                            style={{
                                transitionDuration: duration + 'ms',
                                ...contentStyle,
                                ...(transitionStateStyle[state] || {}),
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseOver={trigger === 'hover' ? onMouseOver : undefined}
                            onMouseLeave={trigger === 'hover' ? onMouseLeave : undefined}
                        >
                            {props.content}
                        </div>
                    )}
                </Transition>,
                document.body,
            )}
        </>
    );
});

Popup.displayName = 'Popup';
export default Popup;

function getRealPosition(anchorEl: HTMLElement, contentEl: HTMLElement, position: PopupPosition, space: number) {
    let newPosition: string = position;
    const slotRect = anchorEl.getBoundingClientRect();
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;
    const contentWidth = contentEl.offsetWidth;
    const contentHeight = contentEl.offsetHeight;

    const canTop = slotRect.top > contentHeight + space;
    const canBottom = clientHeight - slotRect.bottom > contentHeight + space;
    const canLeft = slotRect.left > contentWidth + space;
    const canRight = clientWidth - slotRect.right > contentWidth + space;
    const canEndLeft = clientWidth - slotRect.left > contentWidth;
    const canEndRight = slotRect.right > contentWidth;
    const canEndTop = clientHeight - slotRect.top > contentHeight;
    const canEndBottom = slotRect.bottom > contentHeight;

    if (position.startsWith('top') && !canTop && canBottom) {
        newPosition = newPosition.replace('top', 'bottom');
    } else if (position.startsWith('bottom') && canTop && !canBottom) {
        newPosition = newPosition.replace('bottom', 'top');
    } else if (position.startsWith('left') && !canLeft && canRight) {
        newPosition = newPosition.replace('left', 'right');
    } else if (position.startsWith('right') && canLeft && !canRight) {
        newPosition = newPosition.replace('right', 'left');
    }

    if (position.endsWith('-left') && !canEndLeft && canEndRight) {
        newPosition = newPosition.replace('left', 'right');
    } else if (position.endsWith('-right') && !canEndRight && canEndLeft) {
        newPosition = newPosition.replace('right', 'left');
    } else if (position.endsWith('-top') && !canEndTop && canEndBottom) {
        newPosition = newPosition.replace('top', 'bottom');
    } else if (position.endsWith('-bottom') && canEndTop && !canEndBottom) {
        newPosition = newPosition.replace('bottom', 'top');
    }

    if (position === 'left' || position === 'right') {
        if (clientHeight - slotRect.bottom + slotRect.height / 2 <= contentHeight / 2 && canEndBottom) {
            newPosition += '-bottom';
        } else if (slotRect.top + slotRect.height / 2 <= contentHeight / 2 && canEndTop) {
            newPosition += '-top';
        }
    } else if (position === 'top' || position === 'bottom') {
        if (slotRect.left + slotRect.width / 2 <= contentWidth / 2 && canEndLeft) {
            newPosition += '-left';
        } else if (clientWidth - slotRect.right + slotRect.width / 2 <= contentWidth / 2 && canEndRight) {
            newPosition += '-right';
        }
    }

    return newPosition as PopupPosition;
}

function getRect(el: HTMLElement) {
    const { top, right, bottom, left, width, height } = el.getBoundingClientRect();
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;

    return {
        top,
        right: clientWidth - right,
        bottom: clientHeight - bottom,
        left,
        width,
        height,
    };
}

function getDefaultStyle(anchorEl: HTMLElement, contentEl: HTMLElement, position: PopupPosition) {
    const style: CSSProperties = { opacity: 1 };
    const { top, right, bottom, left, width, height } = getRect(anchorEl);

    if (position.endsWith('-left')) {
        style.left = left + 'px';
    } else if (position.endsWith('-right')) {
        style.right = right + 'px';
    } else if (['bottom', 'top'].includes(position)) {
        style.left = left - (contentEl.offsetWidth - width) / 2 + 'px';
    } else if (position.endsWith('-bottom')) {
        style.bottom = bottom + 'px';
    } else if (position.endsWith('-top')) {
        style.top = top + 'px';
    } else if (['left', 'right'].includes(position)) {
        style.top = top - (contentEl.offsetHeight - height) / 2 + 'px';
    }

    if (position.startsWith('bottom')) {
        style.top = top + height + 'px';
    } else if (position.startsWith('top')) {
        style.bottom = bottom + height + 'px';
    } else if (position.startsWith('left')) {
        style.right = width + right + 'px';
    } else if (position.startsWith('right')) {
        style.left = width + left + 'px';
    }

    return style;
}

function getTransitionStyle(position: PopupPosition, space: number) {
    const hookStyle: { [name: string]: CSSProperties } = {};

    ['entering', 'entered', 'exiting', 'exited'].forEach((hook) => {
        const isExit = hook.startsWith('exit');
        const padding = isExit ? 0 : space + 'px';
        hookStyle[hook] = { opacity: isExit ? 0 : 1 };
        if (position.startsWith('bottom')) {
            hookStyle[hook].paddingTop = padding;
        } else if (position.startsWith('top')) {
            hookStyle[hook].paddingBottom = padding;
        } else if (position.startsWith('left')) {
            hookStyle[hook].paddingRight = padding;
        } else if (position.startsWith('right')) {
            hookStyle[hook].paddingLeft = padding;
        }
    });

    return hookStyle;
}
