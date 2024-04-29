import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import classNames from 'classnames';

export interface PaginationButtonProps extends ComponentContext {
    active?: boolean;
    data: number | 'prev' | 'next' | 'prev-more' | 'next-more';
}

const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
    const classes = classNames(
        'sw-pagination-button',
        [
            'min-w-7',
            'h-7',
            'inline-flex',
            'justify-center',
            'items-center',
            'text-sm',
            'rounded-sm',
            'hover:bg-gray-950',
            'hover:text-white',
        ],
        {
            'bg-gray-950 text-white': props.active,
            'bg-transparent': !props.active,
        },
        props.className,
    );

    return (
        <button className={classes} style={props.style} data-value={props.data}>
            {props.children}
        </button>
    );
};

PaginationButton.displayName = 'PaginationButton';
export default PaginationButton;
