import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { NeedAdmin } from '@/annotation/NeedAdmin';
import { MailSendRecord, MailSendState, MailSendType } from '@/entity/MailSendRecord';
import { FindOptionsWhere, LessThan, MoreThan } from 'typeorm';

interface GetMailRecordsControllerParams {
    email?: string;
    type?: MailSendType;
    state?: MailSendState;
    startAt?: number;
    endAt?: number;
    page: number;
    pageSize: number;
}

interface GetMailRecordsControllerResponse {
    page: number;
    list: MailSendRecord[];
    total: number;
}

@RouteController()
class GetMailRecordsController
    implements AsyncRouteController<GetMailRecordsControllerParams, GetMailRecordsControllerResponse>
{
    @NeedAdmin()
    async execute(
        params: GetMailRecordsControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetMailRecordsControllerResponse>> {
        const { page = 1, pageSize = 10 } = params;

        const mailSendRecordRepo = AppDataSource.getRepository(MailSendRecord);

        const whereParams: FindOptionsWhere<MailSendRecord> = {};
        if (params.email) {
            whereParams.email = params.email;
        }
        if (params.type) {
            whereParams.type = params.type;
        }
        if (params.state !== undefined) {
            whereParams.state = params.state;
        }
        if (params.startAt) {
            whereParams.create_at = MoreThan(new Date(params.startAt));
        }
        if (params.endAt) {
            whereParams.create_at = LessThan(new Date(params.endAt));
        }
        if (params.state) {
            whereParams.state = params.state;
        }

        const [list, total] = await Promise.all([
            mailSendRecordRepo.find({
                where: whereParams,
                take: pageSize,
                skip: (page - 1) * pageSize,
                order: {
                    create_at: 'DESC',
                },
            }),
            mailSendRecordRepo.count({
                where: whereParams,
            }),
        ]);

        return new RouteControllerResult({
            page,
            list,
            total,
        });
    }
}
