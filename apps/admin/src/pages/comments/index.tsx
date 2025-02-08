import { Button, Card, Form, Input, Pagination, Select, Table, openDialog } from '@swai/ui';
import { TableColumn } from '@swai/ui/lib/Table/Table';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { formatTime } from '../../utils/formatTime';
import { Comment, CommentType } from '@swai/types';
import { updateComment, UpdateCommentparams, getCommentList } from '../../api/comment';
import ContentCommentDialog, { ContentCommentDialogRef } from '../../components/comments/ContentCommentDialog';

export default () => {
    const commentDialogRef = useRef<ContentCommentDialogRef | null>(null);

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number>(0);
    const [formData, setFormData] = useState({
        contentId: '',
        type: '',
        visible: '',
        is_deleted: '',
    });

    const columns: TableColumn[] = [
        {
            label: 'ID',
            prop: 'id',
            fixed: 'left',
        },
        {
            label: '内容ID',
            prop: 'contentId',
            fixed: 'left',
        },
        {
            label: '类型',
            prop: 'type',
            render(row: Comment) {
                switch (row.type) {
                    case CommentType.DOC:
                        return '文章';
                    case CommentType.NOTE:
                        return '行博';
                    case CommentType.BOADR:
                        return '留言板';
                    default:
                        return '未知';
                }
            },
        },
        {
            label: 'User',
            prop: 'from',
            render(row: Comment) {
                return row.from.nickname;
            },
        },
        {
            label: 'Content',
            prop: 'content',
            align: 'left',
        },
        {
            label: '回复',
            prop: 'replyCount',
            render(row: Comment) {
                return (
                    <span className="text-link cursor-pointer" onClick={() => onCommentDetail(row)}>
                        {row.replyCount}
                    </span>
                );
            },
        },
        {
            label: '发布时间',
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
            render(row: Comment) {
                return (
                    <div>
                        <Button className="me-4" onClick={() => onVisibleChange(row)}>
                            {row.visible ? '隐藏' : '展示'}
                        </Button>
                        <Button onClick={() => onDeletedChange(row)}>{row.is_deleted ? '恢复' : '删除'}</Button>
                    </div>
                );
            },
        },
    ];

    useEffect(getData, []);

    function getData(page = 1, filters = formData) {
        setLoading(true);
        getCommentList({
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

    function onPageChange(page: number) {
        setPage(() => {
            const newPage = page;

            getData(newPage);
            return newPage;
        });
    }

    function onCommentDetail(comment: Comment) {
        commentDialogRef.current?.open(comment);
    }

    function onVisibleChange(row: Comment) {
        openDialog({
            title: `是否${row.visible ? '隐藏' : '展示'}该条评论`,
            type: 'confirm',
            showClose: false,
            onConfirm: (close) => {
                return doStateChange({ id: row.id, visible: !row.visible }).then(close);
            },
        });
    }

    function onDeletedChange(row: Comment) {
        openDialog({
            title: `是否${row.is_deleted ? '恢复' : '删除'}该条评论`,
            type: 'confirm',
            showClose: false,
            onConfirm: (close) => {
                return doStateChange({ id: row.id, is_deleted: !row.is_deleted }).then(close);
            },
        });
    }

    function doStateChange(data: UpdateCommentparams) {
        return updateComment(data).then((res) => {
            const index = list.findIndex((item) => item.id === res.id);
            if (index > -1) {
                const item = list[index];
                data.visible !== undefined && (item.visible = data.visible);
                data.is_deleted !== undefined && (item.is_deleted = data.is_deleted);

                list.splice(index, 1, item);

                setList([...list]);
            }
        });
    }

    function onFormFieldChange(filed: keyof typeof formData) {
        return function (e: FormEvent<HTMLInputElement> | string) {
            const value = typeof e === 'string' ? e : (e.target as HTMLInputElement).value;
            setFormData({
                ...formData,
                [filed]: value,
            });
        };
    }

    function onSearch() {
        setPage(() => {
            getData(1);

            return 1;
        });
    }

    function onReset() {
        setFormData(() => {
            const data = {
                contentId: '',
                type: '',
                visible: '',
                is_deleted: '',
            };

            setPage(1);
            getData(1, data);

            return data;
        });
    }

    function onCommentReplyChange(id: number, count: number) {
        setList(() => {
            const _list = [...list];
            const comment = _list.find((_) => _.id === id);
            if (comment) {
                comment.replyCount = count;
            }

            return _list;
        });
    }

    return (
        <div>
            <Card className="mb-5">
                <Form className="grid gap-x-5 2xl:grid-cols-5 grid-cols-3" labelAlign="right" labelWidth="80px">
                    <Form.Item name="contentId" label="内容ID">
                        <Input
                            value={formData.contentId}
                            placeholder="请输入内容ID"
                            // @ts-ignore
                            onInput={onFormFieldChange('contentId')}
                        />
                    </Form.Item>
                    <Form.Item name="type" label="类型">
                        <Select
                            value={formData.type}
                            options={[
                                {
                                    label: '文章',
                                    value: 'doc',
                                },
                                {
                                    label: '行博',
                                    value: 'note',
                                },
                                {
                                    label: '留言板',
                                    value: 'board',
                                },
                            ]}
                            placeholder="请选择"
                            onChange={onFormFieldChange('type')}
                        />
                    </Form.Item>
                    <Form.Item name="visible" label="展示状态">
                        <Select
                            value={formData.visible}
                            options={[
                                {
                                    label: '展示',
                                    value: '1',
                                },
                                {
                                    label: '隐藏',
                                    value: '0',
                                },
                            ]}
                            placeholder="请选择"
                            onChange={onFormFieldChange('visible')}
                        />
                    </Form.Item>
                    <Form.Item name="is_deleted" label="状态">
                        <Select
                            value={formData.is_deleted}
                            options={[
                                {
                                    label: '已删除',
                                    value: '1',
                                },
                                {
                                    label: '未删除',
                                    value: '0',
                                },
                            ]}
                            placeholder="请选择"
                            onChange={onFormFieldChange('is_deleted')}
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

            <ContentCommentDialog ref={commentDialogRef} onReplyCountChanged={onCommentReplyChange} />
        </div>
    );
};
