import { Table } from '@swai/ui';
import { TableColumn } from '@swai/ui/lib/Table/Table';

export default () => {
    const columns: TableColumn[] = [
        {
            label: 'Name',
            prop: 'name',
        },
        {
            label: 'Age',
            prop: 'age',
        },
        {
            label: 'Sex',
            prop: 'sex',
        },
    ];

    return (
        <div className="h-[1000px]">
            <Table columns={columns} rowKey="id" source={[]} />
        </div>
    );
};
