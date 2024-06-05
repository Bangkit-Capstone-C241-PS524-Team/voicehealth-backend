import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertBigIntToString } from '../helpers/bigint.helper';

export interface Response<T> {
    status: number;
    message: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        if (
            this.reflector.get<string>('is_file', context.getHandler()) ==
            'true'
        ) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => {
                return {
                    success: true,
                    status: context.switchToHttp().getResponse().statusCode,
                    message:
                        this.reflector.get<string>(
                            'response_message',
                            context.getHandler(),
                        ) || '',
                    data: convertBigIntToString(data),
                };
            }),
        );
    }
}
