'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import { CloseIcon } from '@swai/icon';
import Overlay from '../Overlay';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import Typography from '../Typography';
import { FuncWithoutParams } from '../types/CommonUtils';

export type DrawerDirection = 'left' | 'right' | 'bottom' | 'top';
export interface DrawerProps extends ComponentContext {
    open: boolean;
    title?: string | React.ReactNode;
    showClose?: boolean;
    size?: number | string;
    direction?: DrawerDirection;
    closeOnClickOverlay?: boolean;
    actions?: React.ReactNode;

    onClose?: FuncWithoutParams;
}

const DURATION = 250;

function isColumn(dir: DrawerDirection): boolean {
    return dir === 'bottom' || dir === 'top';
}

function isRow(dir: DrawerDirection): boolean {
    return dir === 'left' || dir === 'right';
}

const Drawer: React.FC<DrawerProps> = (props) => {
    const { open = false, showClose = true, closeOnClickOverlay = true, size, direction = 'left' } = props;

    const nodeRef = useRef(null);
    const [show, setShow] = useState(open);

    useEffect(() => {
        if (props.open) {
            setShow(true);
        }
    }, [open]);

    const defaultStyle = useMemo<React.CSSProperties>(() => {
       return {
            transition: `transform ${DURATION}ms ease-in-out`,
            width: typeof size === 'number' ? `${size}px` : size,
       };
    }, [size]);

    const overlayClasses = useMemo(() => {
        const classes: string[] = ['flex', 'items-stretch'];

        switch (direction) {
            case 'top':
                classes.push('flex-col');
                break;
            case 'bottom':
                classes.push('flex-col-reverse');
                break;
            case 'right':
                classes.push('flex-row-reverse');
                break;
            default:
                break;
        }
        return getClassNames('drawer__overlay', classes, props.className);
    }, [direction]);

    const drawerClasses = useMemo(() => {
        const classes: string[] = ['bg-content dark:bg-content-dark', 'flex', 'flex-col', 'overflow-hidden'];
        if (size === undefined) {
            if (isRow(direction)) {
                classes.push('w-[80%]', 'h-full');
            } else {
                classes.push('max-h-[80%]', 'w-full');
            }
        }

        switch (direction) {
            case 'top':
                classes.push('rounded-b-card');
                break;
            case 'bottom':
                classes.push('rounded-t-card');
                break;
            case 'right':
                classes.push('rounded-l-card');
                break;
            case 'left':
            default:
                classes.push('rounded-r-card');
        }

        return getClassNames('drawer', classes);
    }, [size, direction]);

    const transitionStyles = useMemo<any>(() => {
        const styles: any = {
            entering: {},
            entered: {},
            exiting: {},
            exited: {},
        };
        if (isRow(direction)) {
            styles.entering.transform = styles.entered.transform = 'translateX(0)';
            if (direction === 'left') {
                styles.exiting.transform = styles.exited.transform = 'translateX(-100%)';
            } else {
                styles.exiting.transform = styles.exited.transform = 'translateX(100%)';
            }
        }
        if (isColumn(direction)) {
            styles.entering.transform = styles.entered.transform = 'translateY(0)';
            if (direction === 'top') {
                styles.exiting.transform = styles.exited.transform = 'translateY(-100%)';
            } else {
                styles.exiting.transform = styles.exited.transform = 'translateY(100%)';
            }
        }

        return styles;
    }, [direction]);

    function onExited() {
        setShow(false);
    }

    return show
        ? createPortal(
              <Overlay className={overlayClasses} opacity={0.5} onClick={closeOnClickOverlay ? props.onClose : undefined}>
                  <Transition
                      in={props.open}
                      nodeRef={nodeRef}
                      timeout={DURATION}
                      appear
                      unmountOnExit
                      onExited={onExited}
                  >
                      {(state) => (
                          <div
                              ref={nodeRef}
                              className={drawerClasses}
                              style={{
                                  ...defaultStyle,
                                  ...transitionStyles[state],
                              }}
                              onClick={(e) => e.stopPropagation()}
                          >
                              {props.title ? (
                                  <div
                                      className={getClassNames(
                                          'drawer__head',
                                          'h-12',
                                          'flex', 
                                          'justify-between',
                                          'items-center',
                                          'p-2.5',
                                          'text-primary',
                                          'dark:text-primary-dark',
                                      )}
                                  >
                                      <Typography type='title'>{props.title}</Typography>
                                      {showClose ? <CloseIcon size={20} onClick={props.onClose} /> : null}
                                  </div>
                              ) : null}
                              <div className={getClassNames('drawer__body', 'flex-grow', 'p-2.5', 'overflow-y-auto')}>
                                  {props.children}
                              </div>
                              {props.actions ? <div className={getClassNames('drawer__actions', 'p-2.5 safe-pb-2.5')}>
                                { props.actions }
                              </div> : null}
                          </div>
                      )}
                  </Transition>
              </Overlay>,
              document.body,
          )
        : null;
};

Drawer.displayName = 'Drawer';
export default Drawer;
