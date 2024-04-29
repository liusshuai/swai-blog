import { V2Book } from './Book';

export interface V2BookDetail extends V2Book {
    toc_yml: string;
}
