'use client';

import { DocSearchResult } from '@swai/types';
import { Card, Typography } from '@swai/ui';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import './style.scss';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/rootStore';
import { searchArticle } from '@/api/article/list';

const SearchResultPage = observer(({ store }: { store: typeof rootStore }) => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('q');
    const [result, setResult] = useState<DocSearchResult[]>([]);

    function doSearch() {
        if (!keyword) {
            setResult([]);
        } else {
            searchArticle({
                keyword,
            }).then((res) => {
                console.log(res);
                setResult(res);
            });
        }
    }

    useEffect(doSearch, [keyword]);

    return (
        <div className="tablet:container tablet:mx-auto">
            <Typography type="title" weight="light" className="px-2.5 mb-5 mobile:text-lg tablet:px-0">
                根据关键字 <span className="text-brand font-semibold">{keyword}</span> 查询到以下
                <span className="font-semibold">{result.length}</span>条结果：
            </Typography>
            <Card className="search-result__list mobile:rounded-none">
                {result.map((row) => (
                    <div
                        key={row.id}
                        className="py-4 tablet:px-2.5 border-b border-divider last:border-none dark:border-divider-dark"
                    >
                        <Link
                            className="inline-block mb-3 text-xl font-medium hover:text-link-hover dark:text-primary-dark"
                            dangerouslySetInnerHTML={{ __html: row.title }}
                            href={`/article/${row.id}`}
                        />
                        <p
                            className="text-secondary leading-7 dark:text-secondary-dark"
                            dangerouslySetInnerHTML={{ __html: row.summary }}
                        />
                    </div>
                ))}
            </Card>
        </div>
    );
});

export default () => (
    <Suspense>
        <SearchResultPage store={rootStore} />
    </Suspense>
);
