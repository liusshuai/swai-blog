import { TouristProfile } from '@swai/types';
import { Button, Card, Form, Input, Pagination, Select, openDialog } from '@swai/ui';
import Table, { TableColumn } from '@swai/ui/lib/Table/Table';
import { FormEvent, useEffect, useState } from 'react';
import { ChangeTouristStateParams, changeTouristState, getTouristList } from '../../api/tourist';
import { formatTime } from '../../utils/formatTime';

const enableOptions = [
    {
        label: '是',
        value: '1',
    },
    {
        label: '否',
        value: '0',
    },
];

export default () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [list, setList] = useState<TouristProfile[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        is_black: '',
        un_followed: '',
    });

    const columns: TableColumn[] = [
        {
            label: 'ID',
            prop: 'id',
        },
        {
            label: 'Avatar',
            prop: 'avatar_style',
            render(row: TouristProfile) {
                const { avatar_style, avatar_search } = row;
                return (
                    <img
                        className="w-16 h-16 mx-auto"
                        src={`https://api.dicebear.com/9.x/${avatar_style}/svg${avatar_search ? `?${avatar_search}` : ''}`}
                        alt=""
                    />
                );
            },
        },
        {
            label: '昵称',
            prop: 'nickname',
        },
        {
            label: '邮箱',
            prop: 'email',
        },
        {
            label: '关注',
            prop: 'un_followed',
            render(row: TouristProfile) {
                return row.un_followed ? '未关注' : '已关注';
            },
        },
        {
            label: '黑名单',
            prop: 'status',
            render(row: TouristProfile) {
                return row.is_black ? '是' : '否';
            },
        },
        {
            label: '入站时间',
            prop: 'create_at',
            width: 180,
            render(row) {
                return formatTime(row.create_at);
            },
        },
        {
            label: '操作',
            prop: 'action',
            width: 180,
            fixed: 'right',
            render(row: TouristProfile) {
                return (
                    <div>
                        {!row.un_followed ? (
                            <Button className="me-2.5" onClick={() => doUnFollow(row)}>
                                取消关注
                            </Button>
                        ) : null}
                        <Button color="secondary" onClick={() => doBlockChange(row)}>
                            {row.is_black ? '取消拉黑' : '拉黑'}
                        </Button>
                    </div>
                );
            },
        },
    ];

    useEffect(getData, []);

    function onFormFieldChange(filed: keyof typeof formData) {
        return function (e: FormEvent<HTMLInputElement> | string) {
            const value = typeof e === 'string' ? e : (e.target as HTMLInputElement).value;
            setFormData({
                ...formData,
                [filed]: value,
            });
        };
    }

    function getData(page = 1, filters = formData) {
        setLoading(true);
        getTouristList({
            ...filters,
            page: page,
        })
            .then((res) => {
                setList([...res.list]);
                setTotal(res.total);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function onSearch() {
        getData(1);
    }

    function onReset() {
        setFormData(() => {
            const data = {
                nickname: '',
                email: '',
                is_black: '',
                un_followed: '',
            };

            getData(1, data);

            return data;
        });
    }

    function onPageChange(page: number) {
        setPage(() => {
            const newPage = page;

            getData(newPage);
            return newPage;
        });
    }

    function doUnFollow(row: TouristProfile) {
        openDialog({
            title: '是否取消该用户的关注',
            type: 'confirm',
            showClose: false,
            onConfirm: (close) => {
                return doStateChange({ id: row.id, un_followed: true }).then(close);
            },
        });
    }

    function doBlockChange(row: TouristProfile) {
        openDialog({
            title: `是否${row.is_black ? '取消拉黑' : '拉黑'}该用户`,
            type: 'confirm',
            showClose: false,
            onConfirm: (close) => {
                return doStateChange({ id: row.id, is_black: !row.is_black }).then(close);
            },
        });
    }

    function doStateChange(data: ChangeTouristStateParams) {
        return changeTouristState(data).then((res) => {
            const index = list.findIndex((item) => item.id === res.id);
            if (index > -1) {
                const item = list[index];
                data.is_black !== undefined && (item.is_black = data.is_black);
                data.un_followed !== undefined && (item.un_followed = data.un_followed);

                list.splice(index, 1, item);

                setList([...list]);
            }
        });
    }

    return (
        <div className="">
            <Card className="mb-5">
                <Form className="grid gap-x-5 2xl:grid-cols-5 grid-cols-3" labelAlign="right" labelWidth="80px">
                    <Form.Item name="nickname" label="昵称">
                        <Input
                            value={formData.nickname}
                            // @ts-ignore
                            onInput={onFormFieldChange('nickname')}
                            placeholder="请输入游客昵称"
                        />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱">
                        <Input
                            value={formData.email}
                            // @ts-ignore
                            onInput={onFormFieldChange('email')}
                            placeholder="请输入游客邮箱"
                        />
                    </Form.Item>
                    <Form.Item name="is_black" label="黑名单">
                        <Select
                            value={formData.is_black}
                            options={enableOptions}
                            onChange={onFormFieldChange('is_black')}
                        />
                    </Form.Item>
                    <Form.Item name="un_followed" label="未关注">
                        <Select
                            value={formData.un_followed}
                            options={enableOptions}
                            onChange={onFormFieldChange('un_followed')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button className="me-2.5" onClick={onSearch}>
                            查询
                        </Button>
                        <Button color="secondary" onClick={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card>
                <Table border={false} loading={loading} columns={columns} rowKey="id" source={list} />
                <Pagination className="mt-4 flex justify-end" page={page} total={total} pageChange={onPageChange} />
            </Card>
        </div>
    );
};
