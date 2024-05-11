'use client';
import { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';
import './style.scss';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', typescript);
hljs.registerLanguage('json', json);

export default function DocDetail({ content, sourceUrl }: { content: string; sourceUrl: string }) {
    useEffect(() => {
        hljs.highlightAll();
    }, [content]);

    useEffect(() => {
        /** 为了统计文档的阅读数，内嵌一个iframe打开原文档链接 */
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.yuque.com${sourceUrl}?view=doc_embed&from=LSSHUAISL_BLOG`;
        iframe.style.display = 'none';

        document.body.append(iframe);

        return () => {
            document.body.removeChild(iframe);
        };
    }, [sourceUrl]);

    return <div className="doc-content" dangerouslySetInnerHTML={{ __html: content }}></div>;
}
