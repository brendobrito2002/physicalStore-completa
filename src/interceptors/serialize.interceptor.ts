import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { plainToClass } from "class-transformer";
import { StoreResponseDto } from "src/stores/dtos/store-response.dto";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // Run something before a request is handled
        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                return plainToClass(StoreResponseDto, data, {
                    excludeExtraneousValues: true,
                });
            })
        )
    }
}