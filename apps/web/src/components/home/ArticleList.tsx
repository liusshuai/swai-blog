'use client';
import { MutableRefObject, createRef, useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Typography } from '@swai/ui';
import ArticleCard from './ArticleCard';
import './article.scss';
import { observer } from 'mobx-react-lite';
import docStore from 'store/docStore';
import { Doc } from '@swai/types';
import { SpinIcon } from '@swai/icon';

const ArticleList = observer(({ store }: { store: typeof docStore }) => {
    const process = useRef(null);
    const [docList, setDocList] = useState<(Doc & { nodeRef: MutableRefObject<any> })[]>(
        (store.state.docList || []).map((doc) => ({
            ...doc,
            nodeRef: createRef(),
        })),
    );

    useEffect(() => {
        const callback = ([entry]: IntersectionObserverEntry[]) => {
            if (entry.isIntersecting) {
                store.addPage();
                store.getList().then((list) => {
                    setDocList((docs) => [
                        ...docs,
                        ...list.map((doc) => ({
                            ...doc,
                            nodeRef: createRef(),
                        })),
                    ]);
                });
            }
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: '0px 0px 10% 0px',
            threshold: 0.2,
        });

        if (process.current) {
            observer.observe(process.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [process.current]);

    return (
        <>
            <TransitionGroup>
                {docList.map((doc) => (
                    <CSSTransition key={doc.id} nodeRef={doc.nodeRef} appear timeout={300} classNames="item">
                        <div ref={doc.nodeRef}>
                            <ArticleCard doc={doc} />
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
            {store.state.isEnd ? (
                <Typography type="helper" center>
                    没有更多了～
                </Typography>
            ) : (
                <div ref={process} className="py-1 flex justify-center dark:text-primary-dark">
                    <SpinIcon className="animate-spin" size={18} />
                </div>
            )}
        </>
    );
});

export default () => <ArticleList store={docStore} />;
