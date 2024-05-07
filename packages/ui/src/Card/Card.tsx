import React, { forwardRef } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';

export interface CardProps extends ComponentContext, React.HTMLAttributes<HTMLElement> {
    shadow?: 'always' | 'hover' | 'never';
}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { shadow = 'always', className, style, children } = props;

    const classes = getClassNames(
        `card`,
        [
            'p-5',
            'rounded-card',
            'bg-content dark:bg-content-dark',
            shadow === 'always' ? 'shadow-sm' : shadow === 'hover' ? 'tablet:hover:shadow-sm' : '',
        ],
        className,
    );

    return (
        <div ref={ref} className={classes} style={style}>
            {children}
        </div>
    );
});

Card.displayName = 'Card';
export default Card;
