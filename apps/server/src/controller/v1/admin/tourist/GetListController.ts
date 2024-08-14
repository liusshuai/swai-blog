import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TouristProfile } from '@swai/types';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { FindOptionsWhere, Like } from 'typeorm';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface GetTouristListControllerParams {
    email?: string;
    nickname?: string;
    is_black?: '0' | '1';
    un_followed?: '0' | '1';
    page: number;
    pageSize: number;
}

interface GetTouristListControllerResponse {
    list: TouristProfile[];
    total: number;
}

@RouteController()
class GetTouristListController
    implements AsyncRouteController<GetTouristListControllerParams, GetTouristListControllerResponse>
{
    @NeedAdmin()
    async execute(
        params: GetTouristListControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetTouristListControllerResponse>> {
        const { page = 1, pageSize = 10 } = params;

        const touristRepo = AppDataSource.getRepository(Tourist);

        const whereFilters: FindOptionsWhere<Tourist> = {};
        if (params.nickname) {
            whereFilters.nickname = Like(`%${params.nickname}%`);
        }
        if (params.email) {
            whereFilters.email = Like(`%${params.email}%`);
        }
        if (params.is_black) {
            whereFilters.is_black = params.is_black === '1';
        }
        if (params.un_followed) {
            whereFilters.un_followed = params.un_followed === '1';
        }

        const [list, total] = await Promise.all([
            touristRepo.find({
                take: pageSize,
                skip: (page - 1) * pageSize,
                where: whereFilters,
            }),
            touristRepo.count({
                where: whereFilters,
            }),
        ]);

        return new RouteControllerResult({
            list,
            total,
        });
    }
}
