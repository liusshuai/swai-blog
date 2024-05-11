import { Column, Entity, OneToMany } from "typeorm";
import { BaseComment } from "./BaseComment";
import { CommentReply } from "./CommentReply";

export enum CommentType {
    DOC = 'doc',
    NOTE = 'note',
    BOADR = 'board',
};

@Entity()
export class ContentComment extends BaseComment {
    @Column({
        comment: '评论的内容ID，可为null，为null表示留言板的留言',
        nullable: true,
    })
    contentId!: number;

    @Column({
        type: "enum",
        enum: CommentType,
    })
    type!: CommentType;

    @OneToMany(() => CommentReply, reply => reply.comment)
    replies!: CommentReply[];

    replyCount!: number;
}
