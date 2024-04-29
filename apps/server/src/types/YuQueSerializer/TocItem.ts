import { Toc } from '@swai/types';

export interface V2TocItem extends Toc {
    url: string;
    level: string;
    open_window: 0 | 1;
    visible: 0 | 1;
    prev_uuid: string;
    sibling_uuid: string;
}
