import { PublicState } from '@swai/types';
import { V2User } from './User';

export interface V2Book {
    id: number;
    type: 'Book';
    slug: string;
    name: string;
    user_id: number;
    description: string;
    creator_id: number;
    public: PublicState;
    items_count: number;
    likes_count: number;
    watches_count: number;
    content_updated_at: string;
    created_at: string;
    updated_at: string;
    user: V2User;
    namespace: string;
}
