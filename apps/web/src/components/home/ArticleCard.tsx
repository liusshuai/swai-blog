import { Doc } from '@swai/types';
import { Card, Typography } from '@swai/ui';
import Link from 'next/link';
import DocBaseInfo from '../common/DocBaseInfo';
import { DoubleArrowIcon } from '@swai/icon';

export default function ArticleCard({ doc }: { doc: Doc }) {
    return (
        <Card className="flex flex-col-reverse gap-4 mb-2.5 tablet:flex-row tablet:mb-4 mobile:rounded-none tablet:items-center">
            <div className="grow">
                <Typography type="title" weight="medium">
                    {doc.title}
                </Typography>
                <DocBaseInfo doc={doc} />
                <Typography type="body2">{doc.description}</Typography>
                <div className="mt-5 text-xs flex items-center justify-between text-helper dark:text-helper-dark">
                    <div>
                        <span className="me-4 text-stone">阅读({doc.read_count})</span>
                        <span className="me-4">喜欢({doc.likes_count})</span>
                        <span>评论({doc.comment_count})</span>
                    </div>
                    <Link
                        href={`/article/${doc.id}`}
                        className="inline-flex items-center underline hover:text-link-hover"
                    >
                        阅读全文 <DoubleArrowIcon size={16} />
                    </Link>
                </div>
            </div>
            {doc.cover ? (
                <div className="w-full shrink-0 tablet:w-1/4">
                    <img className="w-full h-full rounded object-cover" src={doc.cover} alt={doc.title} />
                </div>
            ) : null}
        </Card>
    );
}
