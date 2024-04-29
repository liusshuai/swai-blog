'use client';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Drawer, Typography } from '@swai/ui';
import Link from 'next/link';
import FillingMenu from '@/components/filling/FillingMenu';
import tocStore from '@/store/tocStore';

const FilingPage = observer(({ store }: { store: typeof tocStore }) => {
    const [openCates, setOpenCates] = useState<boolean>(false);

    const activeToc = store.activeToc.get();
    const docList = store.activeTocDocs.get();

    useEffect(() => {
        if (store.menus.length === 0 || store.titleMap.size === 0) {
            store.getData();
        }
    }, []);

    function onMenuChange(name: string) {
        setOpenCates(false);
    }

    return (
        <div className="container flex gap-10">
            <Card className="mobile:hidden w-80 pe-4 shrink-0">
                <Typography type="subtitle" className="pb-4">
                    目录 🌻
                </Typography>
                <FillingMenu onMenuChange={onMenuChange} />
            </Card>
            <div className="grow">
                <div className="flex items-center gap-4 mb-5 tablet:hidden">
                    <Button size="default" onClick={() => setOpenCates(true)}>
                        切换
                    </Button>
                    <Typography type="subtitle">{activeToc?.label}</Typography>
                </div>
                <Card>
                    <div className="grid grid-cols-1 gap-4 text-md tablet:grid-cols-3 tablet:py-6 dark:text-primary-dark">
                        {docList.map((doc) => (
                            <Link
                                className="inline-block py-2 px-2.5 rounded tablet:hover:bg-gray-50 tablet:dark:hover:bg-page-dark"
                                key={doc.id}
                                href={`/article/${doc.id}`}
                            >
                                {doc.title}
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            <Drawer className="tablet:hidden" open={openCates} direction="bottom" onClose={() => setOpenCates(false)}>
                <FillingMenu onMenuChange={onMenuChange} />
            </Drawer>
        </div>
    );
});

export default () => <FilingPage store={tocStore} />;
