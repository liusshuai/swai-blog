import { Button, Card, Pagination, Switch, Table } from '@swai/ui';
import { TableColumn } from '@swai/ui/lib/Table/Table';
import { useEffect, useState } from 'react';
import { getDocList } from '../../api/doc';
import { Doc } from '@swai/types';
import { formatTime } from '../../utils/formatTime';

export default () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [list, setList] = useState<Doc[]>([]);
    const [total, setTotal] = useState<number>(0);

    const columns: TableColumn[] = [
        {
            label: 'ID',
            prop: 'id',
            width: 80,
        },
        {
            label: '标题',
            prop: 'title',
            render(row: Doc) {
                if (row.public === 1 && row.status === 1) {
                    return (
                        <a href={`https://www.lsshuaisl.com/article/${row.id}`} target="_blank" className="text-link">
                            {row.title}
                        </a>
                    );
                }
                return row.title;
            },
        },
        {
            label: '全文字数',
            prop: 'word_count',
        },
        {
            label: '点赞数',
            prop: 'likes_count',
        },
        {
            label: '阅读数',
            prop: 'read_count',
        },
        {
            label: '评论数',
            prop: 'comment_count',
        },
        {
            label: '状态',
            prop: 'status',
            render(row: Doc) {
                return row.status === 1 ? '发布' : '草稿';
            },
        },
        {
            label: '是否公开',
            prop: 'public',
            render(row: Doc) {
                return <Switch value={row.public === 1} size="small" />;
            },
        },
        {
            label: '创建时间',
            prop: 'created_at',
            width: 180,
            render(row: Doc) {
                return formatTime(row.created_at);
            },
        },
        {
            label: '更新时间',
            prop: 'updated_at',
            width: 180,
            render(row: Doc) {
                return formatTime(row.updated_at);
            },
        },
        // {
        //     label: '操作',
        //     prop: 'action',
        //     render(row) {
        //         return (
        //             <div>
        //                 <Button>操作</Button>
        //             </div>
        //         );
        //     },
        // },
    ];

    useEffect(getData, []);

    function getData(page = 1) {
        setLoading(true);
        getDocList({
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

    function onPageChange(page: number) {
        setPage(() => {
            const newPage = page;

            getData(newPage);
            return newPage;
        });
    }

    return (
        <div className="">
            <Card>
                <Table border={false} loading={loading} columns={columns} rowKey="id" source={list} />
                <Pagination className="mt-4" page={page} total={total} pageChange={onPageChange} />
            </Card>
        </div>
    );
};
