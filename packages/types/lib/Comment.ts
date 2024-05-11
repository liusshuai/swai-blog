import { TouristProfile } from "./Tourist";

export enum CommentType {
    DOC = 'doc',
    NOTE = 'note',
    BOADR = 'board',
};

export interface Comment {
    id: number;
    visible: boolean;
    from: TouristProfile;
    content: string;
    replies: CommentReply[];
    replyCount: number;
    create_at: string;
    update_at: string;
}

export interface CommentReply {
    id: number;
    visible: boolean;
    from: TouristProfile;
    to: TouristProfile;
    content: string;
    comment_id: number;
    create_at: string;
    update_at: string;
}
