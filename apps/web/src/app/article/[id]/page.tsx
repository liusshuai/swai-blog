import { Button, Card, Typography } from '@swai/ui';
import { get } from '@/utils/request';
import { DocDetail } from '@swai/types';
import Empty from '@/components/common/Empty';
import DocBaseInfo from '@/components/common/DocBaseInfo';
import ArticleDetail from '@/components/article/DocDetail';
import Link from 'next/link';

export default async function DocDetail({ params }: { params: { id: string } }) {
    const detail = await get<DocDetail>('/api/v1/doc/getDetail', { id: params.id });

    return (
        <Card className="py-10 w-full mobile:rounded-none tablet:w-[790px] tablet:mx-auto">
            {detail ? (
                <article className="text-[15px]">
                    <div className="mb-8 tablet:mb-14">
                        <Typography className="" tag="div" type="heading" weight="medium">
                            {detail.title}
                        </Typography>
                        <DocBaseInfo doc={detail} />
                    </div>
                    <ArticleDetail sourceUrl={detail.sourceUrl} content={detail.body_html} />
                </article>
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
            )}
        </Card>
    );
}
