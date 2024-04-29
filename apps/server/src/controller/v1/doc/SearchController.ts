import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { pick } from 'lodash';
import { DocSearchResult } from '@swai/types';

interface SearchControllerParams {
    keyword: string;
    namespace?: string;
}

@RouteController()
class SearchController implements AsyncRouteController<SearchControllerParams, DocSearchResult[]> {
    async execute(params: SearchControllerParams, ctx: Context): Promise<RouteControllerResult<DocSearchResult[]>> {
        const { keyword, namespace } = params;

        const data = (await yqsdk.searchDoc(keyword, namespace)).data;

        return new RouteControllerResult(data.map((row) => pick(row, ['id', 'title', 'summary'])));
    }
}
