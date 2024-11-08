import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import type { Request, Response } from 'express'
import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { ALLOW_NO_TRANSFORM } from '../constant/decorator.constant'

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 获取请求上下文中的 request、response  对象
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    // 判断是否允许返回原生响应数据
    const allowNoTransform = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_TRANSFORM, [context.getHandler(), context.getClass()])

    Logger.verbose(`请求成功 ${request.method.toUpperCase()} ${request.path}`)

    return next.handle().pipe(
      map((data) => {
        if (allowNoTransform) return data

        const result = { code: HttpStatus.OK, success: true, message: '请求成功', result: data, timestamp: Date.now() }
        response.json(result)
      }),
    )
  }
}
