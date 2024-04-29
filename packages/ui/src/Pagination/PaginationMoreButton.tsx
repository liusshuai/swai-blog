import React from 'react';
import PaginationButton from './PaginationButton';
import { PaginationButtonProps } from './PaginationButton';

interface PaginationMoreButtonProps extends Omit<PaginationButtonProps, 'children' | 'active'> {}

const PaginationMoreButton: React.FC<PaginationMoreButtonProps> = (props) => {
    return (
        <PaginationButton {...props}>
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="24" r="3" fill="currentColor" />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
                <circle cx="36" cy="24" r="3" fill="currentColor" />
            </svg>
        </PaginationButton>
    );
};

PaginationMoreButton.displayName = 'PaginationMoreButton';
export default PaginationMoreButton;
