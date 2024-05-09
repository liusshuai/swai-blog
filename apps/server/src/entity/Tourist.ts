import { TouristEntity } from "@swai/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}