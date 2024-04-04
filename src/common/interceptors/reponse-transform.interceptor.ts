/**
 * @description 返回值转化拦截器
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Request, Response } from 'express'
import { HttpStatus } from '@nestjs/common/enums'

@Injectable()
export class ReponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>() // 获取请求上下文中的 request 对象
    const response = context.switchToHttp().getResponse<Response>() // 获取请求上下文中的 response 对象
    Logger.verbose(`请求成功 ${request.url}`)
    return next.handle().pipe(
      map((data) => {
        const isBuffer = Buffer.isBuffer(data)
        // 二进制数据则直接返回 其余数据进行封装返回
        const result = { code: HttpStatus.OK, success: true, message: '请求成功', result: data, timestamp: Date.now() }
        isBuffer ? response.send(data) : response.json(result)
      }),
    )
  }
}
