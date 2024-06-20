import React from 'react';
import { ComponentContext } from '../types/ComponentContext';

export interface TableColumn {
    label: string;
    prop: string;
    width?: number;
}

export interface TableProps extends Omit<ComponentContext, 'children'> {
    columns: TableColumn[];
    source: any[];
    rowKey: string;
}

const Table: React.FC<TableProps> = (props) => {
    const { columns = [], source = [] } = props;
    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">Person</th>
                    <th scope="col">Most interest in</th>
                    <th scope="col">Age</th>
                </tr>
            </thead>
        </table>
    );
};

Table.displayName = 'Table';
export default Table;
