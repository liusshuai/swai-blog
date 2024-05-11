import { TouristEntity } from "@swai/types";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tourist implements TouristEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @Column({
        comment: '游客昵称',
        length: 50,
    })
    nickname!: string;

    @Column({
        comment: '游客邮箱，用于评论回复和文章推送',
        unique: true,
    })
    email!: string;

    @Column({
        comment: '游客站点',
        nullable: true,
    })
    website!: string;

    @Column({
        comment: '游客头像样式',
        default: 'miniavs',
    })
    avatar_style!: string;

    @Column({
        comment: '游客头像参数',
        default: 'seed=Midnight',
    })
    avatar_search!: string;

    @Column({
        comment: '游客上一次浏览的token',
    })
    last_visit_token!: string;

    @Column({
        default: false,
        comment: '游客是否取消订阅，取消订阅将不会被推送新文章，但是还会收到相关评论的回复',
    })
    un_followed!: boolean;

    @CreateDateColumn()
    create_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;
}