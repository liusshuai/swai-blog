import { V2Doc } from './Doc';

export interface V2DocSearchResult {
    id: number;
    type: 'doc';
    title: string;
    summary: string;
    url: string;
    info: string;
    target: V2Doc;
}
