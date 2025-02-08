import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tourist } from './Tourist';

export abstract class BaseComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        comment: '评论是否可见',
        default: true,
    })
    visible!: boolean;

    @ManyToOne(() => Tourist, { eager: true })
    @JoinColumn({ name: 'from_id', referencedColumnName: 'id' })
    from!: Tourist;

    @Column('text')
    content!: string;

    @Column({
        comment: '是否被删除',
        default: false,
    })
    is_deleted!: boolean;

    @CreateDateColumn()
    create_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;
}
