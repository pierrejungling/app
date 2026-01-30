import { isNil } from "lodash";
import { ApiCodeResponse } from "./api-code-response.enum";
import { configManager } from "@common/config";
import { ConfigKey } from "@common/config/enum";
import { Logger } from "@nestjs/common";
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class ApiInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ApiInterceptor.name);


    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const path = ctx.getRequest().route.path;
        return next
            .handle()
            .pipe(
                map((response: any) => {
                   return {code: this.map(path), data: instanceToPlain(response), result: true}
                })
            );
    }

    map(path: String): ApiCodeResponse {
        this.logger.log(`path ${path}`);
        const part = path
            .replace(configManager.getValue(ConfigKey.APP_BASE_URL), '')
            .split('/')
            .filter(s => s.length > 0)
            .slice(0, 2)
            .map(s => s.toUpperCase().replace('-', '_'));
        const code = ApiCodeResponse[`${part.join('_')}_SUCCESS` as keyof typeof ApiCodeResponse];
        return isNil(code) ? ApiCodeResponse.COMMON_SUCCESS : code;
    }
}