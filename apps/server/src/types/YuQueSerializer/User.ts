import { PublicState } from '@swai/types';

export interface V2User {
    id: number;
    type: 'User';
    login: string;
    name: string;
    avatar_url: string;
    books_count: number;
    public_books_count: number;
    followers_count: number;
    following_count: number;
    public: PublicState;
    description: string;
    created_at: string;
    updated_at: string;
}
