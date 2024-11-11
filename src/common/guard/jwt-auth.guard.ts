import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JsonWebTokenError, JwtService } from '@nestjs/jwt'
import { RedisService } from '@/shared/redis.service'
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { ApiException } from '../exception/api.exception'
import { USER_ACCESS_TOKEN_KEY } from '../constant/redis.constant'
import { ALLOW_NO_TOKEN } from '../constant/decorator.constant'
import { AuthEnum } from '../enums'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 若函数请求头配置了 @AllowNoToken() 装饰器，则无需验证 Token 权限
    const allowNoToken = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_TOKEN, [context.getHandler(), context.getClass()])
    if (allowNoToken) return true

    const request = context.switchToHttp().getRequest<Request>()

    try {
      const token = this.extractTokenFromHeader(request)
      const payload = await this.jwtService.verify(token)
      // 校验 Redis 的 accessToken 是否存在且有效；若有效则续期；无效则抛出 JsonWebTokenError
      const redisAccessTokenKey = `${USER_ACCESS_TOKEN_KEY}:${payload.id}`
      const redisAccessToken = await this.redisService.get(redisAccessTokenKey)
      if (!redisAccessToken) throw new JsonWebTokenError(null)
      await this.redisService.expire(redisAccessTokenKey, +process.env.JWT_ACCESS_TIMEOUT)
      // 向全局请求 header 挂载 token 数据
      request.headers[AuthEnum.PAYLOAD] = payload
      return true
    } catch (error: any) {
      // 处理 Jwt 异常
      if (error.name === 'JsonWebTokenError') throw new ApiException(`您的会话已过期或尚未登录。请登录后重试`, HttpStatus.UNAUTHORIZED)
      // 其余异常处理
      throw new ApiException(error.message || '未知异常，请联系管理员')
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
