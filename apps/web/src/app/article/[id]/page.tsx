import { Button } from '@swai/ui';
import type { DocDetail } from '@swai/types';
import Empty from '@/components/common/Empty';
import ArticleDetail from '@/components/article/ArticleDetail';
import Link from 'next/link';
import { getDetail } from '@/api/article/detail';

export default async function DocDetail({ params }: { params: { id: string } }) {
    const detail = await getDetail(params.id);

    return detail ? (
        <ArticleDetail detail={detail} />
    ) : (
        <Empty
            tip="文章不存在或未发布"
            actions={
                <Link href={'/'}>
                    <Button color="secondary" size="small">
                        返回文章列表
                    </Button>
                </Link>
            }
        />
    );
}
