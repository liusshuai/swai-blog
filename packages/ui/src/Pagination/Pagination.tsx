'use client';
import React, { useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import MoreButton from './PaginationMoreButton';
import ArrowButton from './PaginationArrowButton';
import Button from './PaginationButton';

export interface PaginationProps extends Omit<ComponentContext, 'children'> {
    total: number;
    page: number;
    pageSize?: number;

    pageChange?: (page: number) => void;
}

const PAGER_COUNT: number = 7;
const Pagination: React.FC<PaginationProps> = (props) => {
    const { total, page, pageSize = 10 } = props;

    const count = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
    const counts = useMemo(() => {
        const counts: number[] = [];
        for (let i = 2; i < count; i++) {
            counts.push(i);
        }

        return counts;
    }, [count]);

    const renderPager = () => {
        if (count <= PAGER_COUNT) {
            return (
                <>
                    {counts.map((count) => (
                        <Button key={count} data={count} active={page === count}>
                            {count}
                        </Button>
                    ))}
                </>
            );
        }

        if (page - 2 <= 2) {
            return (
                <>
                    {counts.slice(0, 5).map((count) => (
                        <Button key={count} data={count} active={page === count}>
                            {count}
                        </Button>
                    ))}
                    <MoreButton data={'next-more'} />
                </>
            );
        } else if (page + 2 >= count - 1) {
            return (
                <>
                    <MoreButton data={'prev-more'} />
                    {counts.slice(counts.length - 5, counts.length).map((count) => (
                        <Button key={count} data={count} active={page === count}>
                            {count}
                        </Button>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    <MoreButton data={'prev-more'} />
                    {[page - 2, page - 1, page, page + 1, page + 2].map((pager) => (
                        <Button key={pager} data={pager} active={page === pager}>
                            {pager}
                        </Button>
                    ))}
                    <MoreButton data={'next-more'} />
                </>
            );
        }
    };

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (props.pageChange) {
            let target = event.target as HTMLElement;
            while (target.parentElement && target.tagName.toLocaleLowerCase() !== 'button') {
                target = target.parentElement;
            }

            const value = (target as HTMLButtonElement).dataset.value;
            if (!value) return;
            switch (value) {
                case 'prev':
                    if (page > 1) props.pageChange(page - 1);
                    break;
                case 'next':
                    if (page < count) props.pageChange(page + 1);
                    break;
                case 'prev-more':
                    props.pageChange(page - 5);
                    break;
                case 'next-more':
                    props.pageChange(page + 5);
                    break;
                default:
                    if (/[0-9]/.test(value)) {
                        props.pageChange(Number(value));
                    }
                    break;
            }
        }
    }

    return (
        <div className="flex items-center gap-1" onClick={handleClick}>
            <ArrowButton data={'prev'} />
            <Button data={1} active={page === 1}>
                1
            </Button>
            {count > 1 ? (
                <>
                    {renderPager()}
                    <Button data={count} active={page === count}>
                        {count}
                    </Button>
                </>
            ) : null}
            <ArrowButton data={'next'} direction="right" />
        </div>
    );
};

Pagination.displayName = 'Pagination';
export default Pagination;
