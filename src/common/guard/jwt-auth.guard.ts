import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { AuthEnum } from '../enum/auth.enum'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '../enum/config.enum'
import { RedisKey } from '../constant/redis.constant'
import { RedisService } from '@/shared/redis.service'
import { ApiException } from '../exception/api.exception'
import { JsonWebTokenError, JwtService } from '@nestjs/jwt'
import { DecoratorKey } from '../constant/decorator.constant'
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly JWT_EXPIRESIN: number

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    // 将配置的 JWT 过期时间提取到构造函数中，避免每次都从配置中读取
    this.JWT_EXPIRESIN = this.configService.get<number>(ConfigEnum.JWT_EXPIRESIN)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查当前请求是否标记为公共路由，如果是，则无需 Token 验证
    const isPublic = this.reflector.getAllAndOverride<boolean>(DecoratorKey.PUBLIC, [context.getHandler(), context.getClass()]) ?? false
    if (isPublic) return true

    // 通过 ExecutionContext 获取 HTTP 请求对象
    const request = context.switchToHttp().getRequest<Request>()

    // 从请求头中提取 Bearer Token
    const token = this.extractTokenFromHeader(request)

    try {
      // 对请求头携带的 Token 进行校验
      const payload = this.jwtService.verify<JwtPayload>(token)

      // 检查 Redis 中对应的 Token 是否存在
      const ADMIN_USER_TOKEN_KEY = RedisKey.getAdminUserTokenKey(payload.userId)
      const redisToken = await this.redisService.get(ADMIN_USER_TOKEN_KEY)
      if (!redisToken) throw new JsonWebTokenError(null)

      // 如果 Token 存在且通过校验则进行续期
      await this.redisService.expire(ADMIN_USER_TOKEN_KEY, this.JWT_EXPIRESIN)

      request[AuthEnum.PAYLOAD] = payload

      // 校验通过 放行请求
      return true
    } catch (error: any) {
      throw new ApiException('您的会话已过期或尚未登录，请重新登录', HttpStatus.UNAUTHORIZED)
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
