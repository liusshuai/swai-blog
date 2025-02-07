'use client';

import React, { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import classNames from 'classnames';
import { SpinIcon } from '@swai/icon';
import { debounce } from 'lodash-es';
import { onElementSizeChange } from '../utils/dom';

export interface TableColumn {
    label: string;
    prop: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: (row: any) => ReactNode;
}

export interface TableProps extends Omit<ComponentContext, 'children'> {
    columns: TableColumn[];
    source: any[];
    rowKey: string;
    rowHoveredHighlight?: boolean;
    striped?: boolean;
    border?: boolean;
    loading?: boolean;
    headerClasses?: string;
    rowClasses?: string;
}

const Table: React.FC<TableProps> = (props) => {
    const {
        rowKey,
        rowHoveredHighlight = true,
        striped = false,
        border = false,
        loading = false,
        columns = [],
        source = [],
    } = props;

    const rootRef = useRef(null);
    const innerRef = useRef(null);
    const [fixedLeft, setFixedLeft] = useState<boolean>(false);
    const [fixedRight, setFixedRight] = useState<boolean>(false);
    const [fixedLeftWidthList, setFixedLeftWidthList] = useState<number[]>([]);
    const [fixedRightWidthList, setFixedRightWidthList] = useState<number[]>([]);

    const rootClasses = useMemo(() => {
        return getClassNames(
            'table',
            'relative overflow-hidden',
            {
                border: border,
                'w-full': true,
            },
            props.className,
        );
    }, [props.className, border]);

    const headerClasses = useMemo(() => {
        return getClassNames('table__header', ['border-b-2', 'font-medium', 'text-sm'], props.headerClasses);
    }, [props.headerClasses]);

    const tableRowClasses = useMemo(() => {
        return classNames(
            'border-b last:border-b-0 bg-content dark:bg-content-dark',
            {
                'hover:bg-blue-50': rowHoveredHighlight,
                'even:bg-gray-50': striped,
            },
            props.rowClasses,
        );
    }, [props.rowClasses]);

    const fixedRightColWidth = useMemo(() => {
        return fixedRightWidthList.reduce((res, cur) => (res += cur), 0);
    }, [fixedRightWidthList, columns]);

    const fixedLeftColWidth = useMemo(() => {
        return fixedLeftWidthList.reduce((res, cur) => (res += cur), 0);
    }, [fixedLeftWidthList, columns]);

    useLayoutEffect(() => {
        const update = () => {
            computeFixedData();
            innerRef.current && computeShadow(innerRef.current);
        };

        update();

        const disconnect = onElementSizeChange(rootRef.current, update);

        return disconnect;
    }, [columns]);

    const getTableColClasses = (col: TableColumn) => {
        return classNames('px-5 py-3 bg-inherit', {
            'text-center': !col.align || col.align === 'center',
            'text-left': col.align === 'left',
            'text-right': col.align === 'right',
            sticky: col.fixed, // table col fixed
        });
    };

    const getTableColStyles = (col: TableColumn, index: number) => {
        if (col.fixed === 'right') {
            const rest = fixedRightWidthList.slice(fixedRightWidthList.length - columns.length + index + 1);
            const restWidth = rest.reduce((res, cur) => (res += cur), 0);
            return {
                right: restWidth + 'px',
            };
        }

        if (col.fixed === 'left') {
            const rest = fixedLeftWidthList.slice(0, index);
            const restWidth = rest.reduce((res, cur) => (res += cur), 0);
            return {
                left: restWidth + 'px',
            };
        }

        return {};
    };

    const renderTableRow = (row: any) => {
        return columns.map((col, i) =>
            React.createElement(
                i === 0 ? 'th' : 'td',
                {
                    key: i,
                    scope: i === 0 ? 'row' : undefined,
                    className: getTableColClasses(col) + ' font-normal',
                    style: getTableColStyles(col, i),
                },
                col.render ? col.render(row) : row[col.prop],
            ),
        );
    };

    function computeFixedData() {
        if (rootRef.current) {
            const fixedRightNodeList = (rootRef.current as HTMLElement).querySelectorAll('.col-fixed-right');
            const fixedLeftNodeList = (rootRef.current as HTMLElement).querySelectorAll('.col-fixed-left');
            const leftWidthList: number[] = [];
            const rightWidthList: number[] = [];
            fixedRightNodeList.forEach((node) => {
                rightWidthList.push((node as HTMLElement).offsetWidth);
            });
            fixedLeftNodeList.forEach((node) => {
                leftWidthList.push((node as HTMLElement).offsetWidth);
            });
            setFixedRightWidthList(rightWidthList);
            setFixedLeftWidthList(leftWidthList);
        }
    }

    function computeShadow(e: React.UIEvent<HTMLDivElement>) {
        const target = (e.target || e) as HTMLElement;
        const scrollLeft = target.scrollLeft;
        const scrollWidth = target.scrollWidth;
        const targetWidth = target.clientWidth;
        if (scrollLeft > 0) {
            setFixedLeft(true);
        } else {
            setFixedLeft(false);
        }
        if (scrollLeft + targetWidth < scrollWidth) {
            setFixedRight(true);
        } else {
            setFixedRight(false);
        }
    }

    const onTableScroll = debounce(computeShadow);

    return (
        <div ref={rootRef} className={rootClasses}>
            <div ref={innerRef} className={getClassNames('table__inner overflow-x-auto')} onScroll={onTableScroll}>
                <table className="w-full min-w-max">
                    <colgroup>
                        {columns.map((col) => (
                            <col
                                key={col.prop}
                                className={classNames({
                                    'border-r': border,
                                    'col-fixed-right': col.fixed === 'right',
                                    'col-fixed-left': col.fixed === 'left',
                                })}
                                style={{ width: col.width ? col.width + 'px' : 'auto' }}
                            />
                        ))}
                    </colgroup>
                    <thead className={headerClasses}>
                        <tr className="bg-content dark:bg-content-dark">
                            {columns.map((col, i) => (
                                <th
                                    scope="col"
                                    key={col.prop}
                                    className={getTableColClasses(col) + ' whitespace-nowrap'}
                                    style={getTableColStyles(col, i)}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {source.map((row) => (
                            <tr key={row[rowKey]} className={tableRowClasses}>
                                {renderTableRow(row)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {source.length === 0 ? (
                <div className={getClassNames('table__empty', 'min-h-28 text-center pt-12')}>no data.</div>
            ) : null}
            {loading ? (
                <div className="absolute top-0 left-0 w-full h-full bg-white/60">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <SpinIcon className="animate-spin" />
                    </span>
                </div>
            ) : null}
            {fixedLeftWidthList.length > 0 && fixedLeft ? (
                <div
                    className="absolute top-0 w-6 h-full bg-inherit shadow-[6px_0_6px_rgba(0,0,0,.12)]"
                    style={{ left: `${fixedLeftColWidth - 20}px` }}
                ></div>
            ) : null}
            {fixedRightWidthList.length > 0 && fixedRight ? (
                <div
                    className="absolute top-0 w-6 h-full bg-inherit shadow-[-6px_0_6px_rgba(0,0,0,.12)]"
                    style={{ right: `${fixedRightColWidth - 20}px` }}
                ></div>
            ) : null}
        </div>
    );
};

Table.displayName = 'Table';
export default Table;
