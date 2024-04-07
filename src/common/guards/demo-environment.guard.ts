import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { ApiException } from '../exceptions/api.exception'

/**
 * @description 是否演示环境守卫
 */
@Injectable()
export class DemoEnvironmentGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isDemoEnvironment = this.configService.get<boolean>('isDemoEnvironment')
    if (!isDemoEnvironment) return true
    const request = context.switchToHttp().getRequest<Request>()
    const whiteList = ['/login', '/logout'] // 放过的路由
    if (request.method.toUpperCase() !== 'GET' && !whiteList.includes(request.url)) {
      throw new ApiException('演示环境，不允许操作！')
    }
    return true
  }
}
