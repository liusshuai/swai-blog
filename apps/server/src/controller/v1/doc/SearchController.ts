import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { pick } from 'lodash';
import { DocSearchResult } from '@swai/types';

interface SearchControllerParams {
    keyword: string;
    page: number;
}

@RouteController()
class SearchController implements AsyncRouteController<SearchControllerParams, DocSearchResult[]> {
    async execute(params: SearchControllerParams, ctx: Context): Promise<RouteControllerResult<DocSearchResult[]>> {
        const { keyword, page = 1 } = params;

        const data = (await yqsdk.searchDoc(keyword, page)).data;

        return new RouteControllerResult(data.map((row) => pick(row, ['id', 'title', 'summary'])));
    }
}
