'use client';
import React, { useCallback, useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import Button from './PaginationButton';
import { getClassNames } from '../utils/getClassNames';
import { ArrowIcon, MoreIcon } from '@swai/icon';
import { ComponentSize } from '../types/ComponentTypes';

export interface PaginationProps extends Omit<ComponentContext, 'children'> {
    total: number;
    page: number;
    size?: ComponentSize;
    pageSize?: number;
    pagerCount?: number;

    pageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
    const { total, page, size = 'default', pageSize = 10, pagerCount = 7 } = props;

    const count = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
    const counts = useMemo(() => {
        const counts: number[] = [];
        for (let i = 2; i < count; i++) {
            counts.push(i);
        }

        return counts;
    }, [count]);

    const renderMoreBtn = (data: 'prev-more' | 'next-more') => {
        return (
            <Button data={data} size={size}>
                <MoreIcon size={18} />
            </Button>
        );
    };

    const renderPager = useCallback(() => {
        if (count <= pagerCount) {
            return (
                <>
                    {counts.map((count) => (
                        <Button key={count} data={count} active={page === count} size={size}>
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
                        <Button key={count} data={count} active={page === count} size={size}>
                            {count}
                        </Button>
                    ))}
                    {renderMoreBtn('next-more')}
                </>
            );
        } else if (page + 2 >= count - 1) {
            return (
                <>
                    {renderMoreBtn('prev-more')}
                    {counts.slice(counts.length - 5, counts.length).map((count) => (
                        <Button key={count} data={count} active={page === count} size={size}>
                            {count}
                        </Button>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {renderMoreBtn('prev-more')}
                    {[page - 2, page - 1, page, page + 1, page + 2].map((pager) => (
                        <Button key={pager} data={pager} active={page === pager} size={size}>
                            {pager}
                        </Button>
                    ))}
                    {renderMoreBtn('next-more')}
                </>
            );
        }
    }, [page, count, counts, pagerCount]);

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
                        const _page = Number(value);
                        if (_page !== page) {
                            props.pageChange(Number(value));
                        }
                    }
                    break;
            }
        }
    }

    return (
        <div className={getClassNames('pagination', props.className)}>
            <div className="flex items-center gap-1" onClick={handleClick}>
                <Button data={'prev'} disabled={page === 1} size={size}>
                    <ArrowIcon size={18} direction="down" />
                </Button>
                <Button data={1} active={page === 1} size={size}>
                    1
                </Button>
                {count > 1 ? (
                    <>
                        {renderPager()}
                        <Button data={count} active={page === count} size={size}>
                            {count}
                        </Button>
                    </>
                ) : null}
                <Button data={'next'} disabled={page === count} size={size}>
                    <ArrowIcon size={18} />
                </Button>
            </div>
        </div>
    );
};

Pagination.displayName = 'Pagination';
export default Pagination;
