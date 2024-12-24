import { Observable } from 'rxjs'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthEnum } from '../enum/auth.enum'
import { ApiException } from '../exception/api.exception'
import { DecoratorKey } from '../constant/decorator.constant'
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 若函数请求头配置了 @Public() 装饰器，则无需验证 Token 权限
    const isPublic = this.reflector.getAllAndOverride<boolean>(DecoratorKey.PUBLIC, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    try {
      const payload: JwtPayload = this.jwtService.verify(token)

      Reflect.set(request, AuthEnum.PAYLOAD, payload) // 向全局请求 header 挂载 token 数据
      return true
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new ApiException(`您的会话已过期或尚未登录。请登录后重试`, HttpStatus.UNAUTHORIZED) // 处理 Jwt 异常
      }

      throw new ApiException(error.message || '未知异常，请联系管理员') // 其余异常处理
    }
  }

  /**
   * 从请求头中提取 Bearer Token
   * @param {Request} request Express 请求对象
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === AuthEnum.TOKEN_PREFIX ? token : undefined
  }
}
