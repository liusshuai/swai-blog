export const enum TocType {
    Doc = 'DOC',
    Link = 'LINK',
    Title = 'TITLE',
}

export interface Toc {
    uuid: string;
    type: TocType;
    title: string;
    id: number;
    parent_uuid: string;
    child_uuid: string;
}
