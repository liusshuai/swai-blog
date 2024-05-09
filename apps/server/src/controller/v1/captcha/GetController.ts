import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import svgCaptcha from 'svg-captcha';

@RouteController()
class GetController implements AsyncRouteController<void, string> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<string>> {
        
        const captcha = svgCaptcha.create({
            color: true,
            width: 120,
            height: 30,
            fontSize: 42,
        });

        ctx.session!.captcha = captcha.text;

        return new RouteControllerResult(captcha.data);
    }
}
