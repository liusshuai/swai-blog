import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class DocLiked {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({
        comment: '文章id',
    })
    docId!: number;

    @Column({
        comment: '游客id',
    })
    vuid!: string;

    @CreateDateColumn()
    create_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;
}
