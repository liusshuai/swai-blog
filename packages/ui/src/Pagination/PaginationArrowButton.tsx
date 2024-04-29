import React from 'react';
import PaginationButton from './PaginationButton';
import { PaginationButtonProps } from './PaginationButton';

interface PaginationArrowButtonProps extends Omit<PaginationButtonProps, 'children' | 'active'> {
    direction?: 'left' | 'right';
}

const PaginationArrowButton: React.FC<PaginationArrowButtonProps> = (props) => {
    const { direction = 'left', ...extraProps } = props;
    return (
        <PaginationButton {...extraProps}>
            <svg
                className={direction === 'right' ? 'rotate-180' : ''}
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M24 36L12 24L24 12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M36 36L24 24L36 12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </PaginationButton>
    );
};

PaginationArrowButton.displayName = 'PaginationArrowButton';
export default PaginationArrowButton;
