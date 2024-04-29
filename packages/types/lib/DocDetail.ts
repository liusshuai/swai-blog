import { Doc } from './Doc';

export interface DocDetail extends Doc {
    body_html: string;
    sourceUrl: string;
}
