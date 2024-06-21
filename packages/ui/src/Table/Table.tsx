import React, { useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import classNames from 'classnames';

export interface TableColumn {
    label: string;
    prop: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
}

export interface TableProps extends Omit<ComponentContext, 'children'> {
    columns: TableColumn[];
    source: any[];
    rowKey: string;
    rowHoveredHighlight?: boolean;
    striped?: boolean;
    border?: boolean;
    headerClasses?: string;
    rowClasses?: string;
}

const Table: React.FC<TableProps> = (props) => {
    const { rowKey, rowHoveredHighlight = true, striped = false, border = false, columns = [], source = [] } = props;

    const rootClasses = useMemo(() => {
        return getClassNames(
            'table',
            {
                border: border,
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
                    className: getTableColClasses(col),
                },
                row[col.prop],
            ),
        );
    };

    return (
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
    );
};

Table.displayName = 'Table';
export default Table;
