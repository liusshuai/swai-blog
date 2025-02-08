import { FormEvent, useEffect, useState } from 'react';
import { MailSendType, MailSendState } from '@swai/types';
import { Card, Form, DatePicker, Input, Select, Button, Pagination } from '@swai/ui';
import Table, { TableColumn } from '@swai/ui/lib/Table/Table';
import { getMailSendRecords, GetMailSendRecordsParams, MailSendRecord } from '../../api/mailRecords';
import { formatTime } from '../../utils/formatTime';

const StateMap = {
    [MailSendState.PENDING]: '待发送',
    [MailSendState.SUCCESS]: '成功',
    [MailSendState.FAIL]: '失败',
};
const TypeMap = {
    [MailSendType.EMAIL_VERIFY]: '邮箱验证',
    [MailSendType.NEW_DOC]: '新文章',
    [MailSendType.NEW_REPAY]: '新回复',
};

const typeFilterOptions = Object.entries(TypeMap).map(([k, v]) => ({
    label: v,
    value: k,
}));
const stateFilterOptions = Object.entries(StateMap).map(([k, v]) => ({
    label: v,
    value: k,
}));

export default () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<GetMailSendRecordsParams>({
        state: undefined,
        email: '',
        type: undefined,
        startAt: undefined,
        endAt: undefined,
    });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number>(0);
    const [list, setList] = useState<MailSendRecord[]>([]);

    const columns: TableColumn[] = [
        {
            label: 'ID',
            prop: 'id',
        },
        {
            label: '邮箱',
            prop: 'email',
        },
        {
            label: '邮件类型',
            prop: 'type',
            render(row: MailSendRecord) {
                return TypeMap[row.type];
            },
        },
        {
            label: '状态',
            prop: 'state',
            render(row: MailSendRecord) {
                return StateMap[row.state];
            },
        },
        {
            label: '发送时间',
            prop: 'create_at',
            render(row) {
                return formatTime(row.create_at);
            },
        },
        // {
        //     label: '操作',
        //     prop: 'action',
        //     width: 180,
        //     fixed: 'right',
        //     render(row: any) {
        //         return <div></div>;
        //     },
        // },
    ];

    useEffect(getData, []);

    function getData(page = 1, filters = formData) {
        setLoading(true);
        getMailSendRecords({
            ...filters,
            page: page,
            pageSize: 20,
        })
            .then((res) => {
                setList([...res.list]);
                setTotal(res.total);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function onFormFieldChange(filed: keyof typeof formData) {
        return function (e: FormEvent<HTMLInputElement> | string) {
            const value = e instanceof Object && e.target ? (e.target as HTMLInputElement).value : e;

            setFormData({
                ...formData,
                [filed]: value,
            });
        };
    }

    function onSubmit() {
        onPageChange(1);
    }

    function onReset(e: any) {
        e.stopPropagation();
        e.preventDefault();
        setFormData(() => {
            const filters = {
                state: undefined,
                email: '',
                type: undefined,
                startAt: undefined,
                endAt: undefined,
            };

            getData(1, filters);

            return filters;
        });
    }

    function onPageChange(page: number) {
        setPage(() => {
            const newPage = page;

            getData(newPage);
            return newPage;
        });
    }

    return (
        <div>
            <Card className="mb-5">
                <Form
                    className="grid gap-x-5 2xl:grid-cols-5 grid-cols-3"
                    labelAlign="right"
                    labelWidth="80px"
                    onSubmit={onSubmit}
                >
                    <Form.Item name="email" label="邮箱">
                        <Input
                            value={formData.email}
                            // @ts-ignore
                            onInput={onFormFieldChange('email')}
                            placeholder="请输入邮箱"
                        />
                    </Form.Item>
                    <Form.Item name="type" label="类型">
                        <Select
                            value={formData.type}
                            options={typeFilterOptions}
                            onChange={onFormFieldChange('state')}
                        />
                    </Form.Item>
                    <Form.Item name="state" label="状态">
                        <Select
                            value={formData.state}
                            options={stateFilterOptions}
                            onChange={onFormFieldChange('state')}
                        />
                    </Form.Item>
                    <Form.Item name="startAt" label="起始时间">
                        <DatePicker
                            value={formData.startAt}
                            onChange={onFormFieldChange('startAt')}
                            placeholder="请选择开始时间"
                        />
                    </Form.Item>
                    <Form.Item name="endAt" label="截止时间">
                        <DatePicker
                            value={formData.endAt}
                            onChange={onFormFieldChange('endAt')}
                            placeholder="请选择截止时间"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button className="me-2.5" type="submit">
                            查询
                        </Button>
                        <Button color="secondary" onClickCapture={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card>
                <Table border={false} loading={loading} columns={columns} rowKey="id" source={list} />
                <div className="mt-4 flex justify-end">
                    <Pagination page={page} pageSize={20} total={total} pageChange={onPageChange} />
                </div>
            </Card>
        </div>
    );
};
