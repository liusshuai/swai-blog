import { Column, Entity, OneToMany } from 'typeorm';
import { CommentType } from '@swai/types';
import { BaseComment } from './BaseComment';
import { CommentReply } from './CommentReply';

@Entity()
export class ContentComment extends BaseComment {
    @Column({
        comment: '评论的内容ID，，为0表示留言板的留言',
    })
    contentId!: number;

    @Column({
        type: 'enum',
        enum: CommentType,
    })
    type!: CommentType;

    @OneToMany(() => CommentReply, (reply) => reply.comment)
    replies!: CommentReply[];

    replyCount!: number;
}
