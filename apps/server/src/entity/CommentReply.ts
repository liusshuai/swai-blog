import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseComment } from './BaseComment';
import { Tourist } from './Tourist';
import { ContentComment } from './ContentComment';

@Entity()
export class CommentReply extends BaseComment {
    @ManyToOne(() => Tourist, { eager: true })
    @JoinColumn({ name: 'to_id', referencedColumnName: 'id' })
    to!: Tourist;

    @ManyToOne(() => ContentComment, (comment) => comment.replies)
    @JoinColumn({ name: 'comment_id' })
    comment!: ContentComment;
}
