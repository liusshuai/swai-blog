import { V2Doc } from './Doc';

export enum ContentFormat {
    Markdown = 'markdown',
    Lake = 'lake',
    Html = 'html',
}

export interface V2DocDetail extends V2Doc {
    format: ContentFormat;
    body_draft: string;
    body: string;
    body_html: string;
    body_lake: string;
}
