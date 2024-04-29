import { Doc } from '@swai/types';
import { V2Book } from './Book';
import { V2Tag } from './Tag';
import { V2User } from './User';

export interface V2Doc extends Doc {
    type: 'Doc';
    user_id: number;
    book_id: number;
    last_editor_id: number;
    comments_count: number;
    content_updated_at: string;
    first_published_at: string;
    book: V2Book;
    user: V2User;
    last_editor: V2User;
    latest_version_id: number;
    tags: V2Tag[];
}
