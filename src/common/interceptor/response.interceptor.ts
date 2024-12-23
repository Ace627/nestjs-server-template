import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import type { Request, Response } from 'express'
import { DecoratorKey } from '../constant/decorator.constant'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, HttpStatus } from '@nestjs/common'

/**
 * http://nestjs.inode.club/interceptors
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 获取请求上下文中的 request 对象
    const request = context.switchToHttp().getRequest<Request>()
    // 获取请求上下文中的 response 对象
    const response = context.switchToHttp().getResponse<Response>()

    // 判断是否允许返回原生响应数据
    const allowNoTransform = this.reflector.getAllAndOverride<boolean>(DecoratorKey.RAW, [context.getHandler(), context.getClass()])

    Logger.verbose(`请求成功 ${request.method.toUpperCase()} ${request.path}`)

    return next.handle().pipe(
      map((data) => {
        // 返回原生数据
        if (allowNoTransform) return data
        // 返回包装后的数据
        const result = { code: HttpStatus.OK, success: true, message: '请求成功', result: data, timestamp: Date.now() }
        response.setHeader('Content-Type', 'application/json')
        response.json(result)
      }),
    )
  }
}
