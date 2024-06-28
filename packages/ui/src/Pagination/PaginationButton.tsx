import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { ComponentSize } from '../types/ComponentTypes';
import { CONTROL_HEIGHT, MIN_CONTROL_WIDTH } from '../utils/constants';
import { getClassNames } from '../utils/getClassNames';

export interface PaginationButtonProps extends ComponentContext {
    active?: boolean;
    data: number | 'prev' | 'next' | 'prev-more' | 'next-more';
    size?: ComponentSize;
    disabled?: boolean;
}

const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
    const { size = 'default', disabled, active } = props;

    const classes = getClassNames(
        'pagination__button',
        ['inline-flex', 'justify-center', 'items-center', 'px-1', 'text-sm', 'rounded', 'select-none'],
        [CONTROL_HEIGHT[size], MIN_CONTROL_WIDTH[size]],
        {
            'hover:bg-gray-50': !active && !disabled,
            'bg-primary text-white': active,
            'bg-transparent': !active,
            'opacity-30 cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
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
