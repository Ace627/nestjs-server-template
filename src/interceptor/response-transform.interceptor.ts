import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Request, Response } from 'express'
import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common'

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 获取请求上下文中的 request、response  对象
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    Logger.verbose(`请求成功 ${request.method.toUpperCase()} ${request.url}`)

    return next.handle().pipe(
      map((data) => {
        const result = { code: HttpStatus.OK, success: true, message: '请求成功', result: data, timestamp: Date.now() }
        response.json(result)
      }),
    )
  }
}
