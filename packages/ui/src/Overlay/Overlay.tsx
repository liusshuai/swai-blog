'use client';
import React, { useEffect } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { FuncWithoutParams } from '../types/CommonUtils';

export interface OverlayProps extends ComponentContext {
    opacity?: number;
    zIndex?: number;

    onClick?: FuncWithoutParams;
}

const Overlay: React.FC<OverlayProps> = (props) => {
    const { zIndex, opacity = 0.7, className } = props;

    const classes = getClassNames('overlay', ['fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'z-overlay'], className);
    const BodyOverflowStyleStack: string[] = [];

    useEffect(() => {
        BodyOverflowStyleStack.push(document.body.style.overflow);

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = BodyOverflowStyleStack.pop() || '';
        };
    }, []);

    return (
        <div
            className={classes}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                zIndex,
            }}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
};

Overlay.displayName = 'Overlay';
export default Overlay;
