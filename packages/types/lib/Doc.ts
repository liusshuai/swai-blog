export const enum PublicState {
    Private = 0,
    Public,
}

export const enum EditStatus {
    UnPublish = 0,
    Published,
}

export interface Doc {
    id: number;
    slug: string;
    title: string;
    description: string;
    cover: string;
    public: PublicState;
    status: EditStatus;
    likes_count: number;
    read_count: number;
    word_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
}
