import { Observable } from 'rxjs'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { AuthEnum } from '../enum/auth.enum'
import { DecoratorKey } from '../constant/decorator.constant'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const isAutoAudit = this.reflector.get<boolean>(DecoratorKey.AUTO_AUDIT, context.getHandler()) ?? false
    if (!isAutoAudit) return next.handle()

    // 获取请求上下文中的 request 对象
    const request = context.switchToHttp().getRequest<Request>()

    const payload: JwtPayload = request[AuthEnum.PAYLOAD] || {}

    // 添加操作
    if (!Reflect.has(request.body, 'id')) {
      request.body.createBy = payload.username ?? 'admin'
      request.body.updateBy = payload.username ?? 'admin'
    }

    // 更新操作
    if (Reflect.has(request.body, 'id')) {
      request.body.updateBy = payload.username ?? 'admin'
    }

    return next.handle()
  }
}
