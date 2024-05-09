'use client';
import React, { useEffect, useRef, useState } from "react";
import { Transition } from 'react-transition-group';
import { ComponentContext } from "../types/ComponentContext";
import { createPortal } from "react-dom";
import Overlay from "../Overlay";
import Card from "../Card";
import { getClassNames } from "../utils/getClassNames";
import { CloseIcon } from "@swai/icon";
import Typography from "../Typography";

export interface DialogProps extends ComponentContext {
    open: boolean;
    width?: string;
    title?: string | React.ReactNode;
    showClose?: boolean;
    actions?: React.ReactNode;
    closeOnClickOverlay?: boolean;

    onClose?: () => void;
}

const DURATION = 200;
const Dialog: React.FC<DialogProps> = (props) => {
    const { open = false, width, showClose = true, closeOnClickOverlay = true } = props;
    const [show, setShow] = useState<boolean>(open);

    const nodeRef = useRef(null);

    useEffect(() => {
        if (props.open) {
            setShow(true);
        }
    }, [open]);

    const defaultStyle: React.CSSProperties = {
        transition: `transform ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out`,
        transform: 'translateY(50%)',
        opacity: 0,
    };

    const transitionStyles: any = {
        entering: {
            transform: 'translateY(0)',
            opacity: 1,
        },
        entered: {
            transform: 'translateY(0)',
            opacity: 1,
        },
        exiting: {
            transform: 'translateY(50%)',
            opacity: 0,
        },
        exited: {
            transform: 'translateY(50%)',
            opacity: 0,
        },
    };

    const overlayClasses = getClassNames('dialog__overlay', [
        'flex justify-center items-center'
    ]);
    const dialogClasses = getClassNames('dialog', props.className);

    function onExited() {
        setShow(false);
    }

    return show
    ? createPortal(
        <Overlay className={overlayClasses} onClick={closeOnClickOverlay ? props.onClose : undefined}>
            <Transition
                in={props.open}
                nodeRef={nodeRef}
                timeout={DURATION}
                appear
                unmountOnExit
                onExited={onExited}
            >
                {(state) => (
                    <Card
                        ref={nodeRef}
                        className={dialogClasses}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            width,
                            minWidth: 400,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {props.title ? (
                            <div
                                className={getClassNames(
                                    'dialog__head',
                                    'flex',
                                    'justify-between',
                                    'items-center',
                                    'p-2.5',
                                    'text-primary',
                                    'dark:text-primary-dark',
                                )}
                            >
                                <Typography type="title">{props.title}</Typography>
                                {showClose ? <CloseIcon size={20} className="cursor-pointer" onClick={props.onClose} /> : null}
                            </div>
                        ) : null}
                        <div className={getClassNames('dialog__body', 'p-2.5')}>
                            {props.children}
                        </div>
                        {props.actions ? <div className={getClassNames('dialog__actions', 'px-2.5')}>{ props.actions }</div> : null}
                    </Card>
                )}
            </Transition>
        </Overlay>,
        document.body
    ) : null;
}

Dialog.displayName = 'Dialog';
export default Dialog;
