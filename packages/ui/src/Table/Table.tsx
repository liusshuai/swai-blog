import React, { ReactNode, useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import classNames from 'classnames';
import { SpinIcon } from '@swai/icon';

export interface TableColumn {
    label: string;
    prop: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
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

    const rootClasses = useMemo(() => {
        return getClassNames(
            'table',
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
            'border-b last:border-b-0',
            {
                'hover:bg-blue-50': rowHoveredHighlight,
                'even:bg-gray-50': striped,
            },
            props.rowClasses,
        );
    }, [props.rowClasses]);

    const getTableColClasses = (col: TableColumn) => {
        return classNames('px-5 py-3', {
            'text-center': !col.align || col.align === 'center',
            'text-left': col.align === 'left',
            'text-right': col.align === 'right',
        });
    };

    const renderTableRow = (row: any) => {
        return columns.map((col, i) =>
            React.createElement(
                i === 0 ? 'th' : 'td',
                {
                    scope: i === 0 ? 'row' : undefined,
                    className: getTableColClasses(col) + ' font-normal',
                },
                col.render ? col.render(row) : row[col.prop],
            ),
        );
    };

    return (
        <div className="relative">
            <table className={rootClasses}>
                <colgroup>
                    {columns.map((col) => (
                        <col
                            key={col.prop}
                            className={classNames({
                                'border-r': border,
                            })}
                            style={{ width: col.width ? col.width + 'px' : 'auto' }}
                        />
                    ))}
                </colgroup>
                <thead className={headerClasses}>
                    <tr>
                        {columns.map((col) => (
                            <th scope="col" key={col.prop} className={getTableColClasses(col)}>
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
        </div>
    );
};

Table.displayName = 'Table';
export default Table;
