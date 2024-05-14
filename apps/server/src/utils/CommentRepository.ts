import { AppDataSource } from '@/common/database';
import { CommentReply } from '@/entity/CommentReply';
import { CommentType, ContentComment } from '@/entity/ContentComment';
import { Tourist } from '@/entity/Tourist';
import type { Repository } from 'typeorm';

export interface AddCommentPayload {
    fromId: string;
    contentId?: number;
    content: string;
}

export interface GetCommentsPayload {
    contentId?: number;
    page: number;
    pageSize?: number;
}

export class CommentRepository {
    static touristRepo = AppDataSource.getRepository(Tourist);
    static commentRepo = AppDataSource.getRepository(ContentComment);
    static replyRepo = AppDataSource.getRepository(CommentReply);

    static async getTourist(vuid: string): Promise<Tourist> {
        const tourist = await this.touristRepo.findOneBy({ id: vuid });
        if (!tourist) {
            throw new Error('游客信息错误');
        }

        return tourist;
    }

    static async addComment(type: CommentType, payload: AddCommentPayload) {
        const { fromId, content, contentId } = payload;

        const tourist = await this.getTourist(fromId);

        const comment = new ContentComment();
        comment.type = type;
        comment.from = tourist;
        comment.content = content;
        if (type !== CommentType.BOADR) {
            if (!contentId) {
                throw new Error('missing required param: contentId');
            }
            comment.contentId = contentId;
        }

        await this.commentRepo.save(comment);

        return comment;
    }

    static async getComments(type: CommentType, payload: GetCommentsPayload) {
        const { contentId, page, pageSize = 10 } = payload;
        const comments = await this.commentRepo.find({
            where: {
                type,
                contentId,
                visible: true,
                is_deleted: false,
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
            order: {
                create_at: 'DESC',
            },
        });

        for (const comment of comments) {
            const replies = await this.replyRepo
                .createQueryBuilder('reply')
                .where('reply.comment_id = :commentId', { commentId: comment.id })
                .andWhere('reply.visible = 1')
                .andWhere('reply.is_deleted = 0')
                .leftJoinAndSelect('reply.from', 'from')
                .leftJoinAndSelect('reply.to', 'to')
                .take(2)
                .orderBy('reply.create_at', 'DESC')
                .getMany();
            const count = await this.replyRepo
                .createQueryBuilder('reply')
                .where('reply.comment_id = :commentId', { commentId: comment.id })
                .andWhere('reply.visible = 1')
                .andWhere('reply.is_deleted = 0')
                .getCount();

            comment.replies = replies;
            comment.replyCount = count;
        }

        // const comments = await this.commentRepo
        //     .createQueryBuilder('comment')
        //     .where('comment.type = :type', { type })
        //     .andWhere('comment.contentId = :contentId', { contentId })
        //     .andWhere('comment.visible = 1')
        //     .leftJoinAndSelect('comment.from', 'from')
        //     .leftJoin('comment.replies', 'reply', 'reply.visible = 1')
        //     .addSelect(['reply'])
        //     .leftJoinAndSelect('reply.from', 'replyFrom')
        //     .leftJoinAndSelect('reply.to', 'to')
        //     .orderBy({
        //         'comment.create_at': 'DESC',
        //         'reply.create_at': 'DESC',
        //     })
        //     .take(pageSize)
        //     .skip((page - 1) * pageSize)
        //     .getMany();

        return comments;
    }

    static async addReply(commentId: number, payload: { content: string; from: string; to: string }) {
        const fromTourist = await this.getTourist(payload.from);
        const toTourist = await this.getTourist(payload.to);

        const comment = await this.commentRepo.findOneBy({
            id: commentId,
        });

        if (!comment) {
            throw new Error(`can not find comment by id: ${commentId}`);
        }

        const reply = new CommentReply();

        reply.content = payload.content;
        reply.from = fromTourist;
        reply.to = toTourist;
        reply.comment = comment;

        await this.replyRepo.save(reply);

        return reply;
    }

    static async getReplies(commentId: number) {
        return this.replyRepo
            .createQueryBuilder('reply')
            .where('reply.comment_id = :commentId', { commentId })
            .andWhere('reply.visible = 1')
            .andWhere('reply.is_deleted = 0')
            .leftJoinAndSelect('reply.from', 'from')
            .leftJoinAndSelect('reply.to', 'to')
            .orderBy('reply.create_at', 'DESC')
            .getManyAndCount();
    }

    static async getContentCommentCount(type: CommentType, contentId: number): Promise<number> {
        const result = await AppDataSource.createQueryBuilder()
            .select('comment.id', 'commentId')
            .addSelect('COUNT(DISTINCT reply.id)', 'replyCount')
            .from(ContentComment, 'comment')
            .leftJoin('comment.replies', 'reply', 'reply.visible = 1 AND reply.is_deleted = 0')
            .where('comment.contentId = :contentId', { contentId })
            .andWhere('comment.type = :type', { type })
            .andWhere('comment.visible = 1')
            .andWhere('comment.is_deleted = 0')
            .groupBy('comment.id')
            .getRawMany();

        const total: number = result.reduce((sum, { replyCount }) => (sum += parseInt(replyCount, 10)), result.length);

        return total;
    }

    private static async doCommentRemove(repo: Repository<ContentComment | CommentReply>, id: number, vuid: string) {
        const row = await repo.findOneBy({ id });

        if (!row) {
            throw new Error(`can not find comment form id: ${id}`);
        }

        if (row.from.id !== vuid) {
            throw new Error(`no permission`);
        }

        row.is_deleted = true;
        row.visible = false;

        await repo.save(row);
    }

    static async removeComment(commentId: number, vuid: string) {
        await this.doCommentRemove(this.commentRepo, commentId, vuid);
    }

    static async removeReply(replyId: number, vuid: string) {
        await this.doCommentRemove(this.replyRepo, replyId, vuid);
    }
}
