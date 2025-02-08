import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum MailSendType {
    NEW_DOC = 'new_doc',
    NEW_REPAY = 'new_reply',
    EMAIL_VERIFY = 'email_verify',
}

export enum MailSendState {
    PENDING = 0,
    FAIL = -1,
    SUCCESS = 1,
}

@Entity()
export class MailSendRecord {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({
        comment: '邮箱',
    })
    email!: string;

    @Column({
        type: 'enum',
        enum: MailSendType,
    })
    type!: MailSendType;

    @Column({
        type: 'enum',
        default: MailSendState.PENDING,
        enum: MailSendState,
        comment: '发送状态',
    })
    state!: MailSendState;

    @CreateDateColumn()
    create_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;
}
