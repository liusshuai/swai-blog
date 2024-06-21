import { Card, Table } from '@swai/ui';
import { TableColumn } from '@swai/ui/lib/Table/Table';

export default () => {
    const columns: TableColumn[] = [
        {
            label: 'ID',
            prop: 'id',
            width: 80,
        },
        {
            label: '标题',
            prop: 'title',
            width: 160,
        },
        {
            label: '描述',
            prop: 'description',
            width: 400,
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
            prop: 'comments_count',
        },
        {
            label: '状态',
            prop: 'status',
        },
        {
            label: '是否公开',
            prop: 'public',
        },
        {
            label: '创建时间',
            prop: 'created_at',
            width: 180,
        },
        {
            label: '更新时间',
            prop: 'updated_at',
            width: 180,
        },
    ];

    const source = [
        {
            id: 1,
            title: 'tsc编译项目的别名',
            description: `在typescript项目中使用别名的场景：import { add } from '../../utils/add';想要通过别名引入，如：import { add } from '@/utils/add';首先需要配置tsconfig.json的baseUrl和paths，如下：// ts...`,
            word_count: 3000,
            likes_count: 100,
            read_count: 10000,
            comments_count: 20,
            status: 1,
            public: 1,
            created_at: '2024-03-06 18:06',
            updated_at: '2024-05-06 12:16',
        },
        {
            id: 2,
            title: 'BFC',
            description: `BFC（Block Formatting Context）：块格式化上下文，是web页面中盒模型布局的一种CSS渲染模式；在BFC中，盒子会垂直布局，并且可以包含浮动元素；创建BFC元素，会对其他内部的子元素进行独立布局，而与外部的其他元素互不影响；创建BFC的情况根元素：<html>浮动元素...`,
            word_count: 3000,
            likes_count: 100,
            read_count: 10000,
            comments_count: 20,
            status: 1,
            public: 1,
            created_at: '2024-03-06 18:06',
            updated_at: '2024-05-06 12:16',
        },
        {
            id: 3,
            title: '十六进制、十进制转换',
            description: `十六进制数字可以通过#或者0x表示，如：0x1A或#1A；A~F对应数字10-15；转换规则跟二进制转十进制、十进制转二进制一样，只是除/乘的基数变成了16；如：0x1A转换成十进制，就是 1 * (16 ^1) + 10 * (16 ^0) = 26代码题：// 将十六进制颜色值转换成rgb...`,
            word_count: 3000,
            likes_count: 100,
            read_count: 10000,
            comments_count: 20,
            status: 1,
            public: 1,
            created_at: '2024-03-06 18:06',
            updated_at: '2024-05-06 12:16',
        },
    ];

    return (
        <div className="h-[1000px]">
            <Card>
                <Table border={false} columns={columns} rowKey="id" source={source} />
            </Card>
        </div>
    );
};
