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
    if (this.isPublic(context)) return true

    const request = context.switchToHttp().getRequest<Request>() // 通过 ExecutionContext 获取 HTTP 请求对象
    const token = this.extractTokenFromHeader(request)

    try {
      const payload: JwtPayload = this.verifyToken(token)
      await this.checkTokenInRedis(payload)
      Reflect.set(request, AuthEnum.PAYLOAD, payload) // 将 Payload 保存到请求对象中
      return true // 成功验证，允许访问
    } catch (error) {
      this.handleTokenError(error)
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

  /**
   * 检查当前请求是否标记为公共路由，无需 Token 验证
   * @returns {boolean} 不需要验证返回 true、需要验证则返回 false
   */
  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(DecoratorKey.PUBLIC, [context.getHandler(), context.getClass()]) ?? false
  }

  private verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new JsonWebTokenError('Token 无效或已过期')
    }
  }

  private async checkTokenInRedis(payload: JwtPayload) {
    const ADMIN_USER_TOKEN_KEY = `${RedisKey.ADMIN_USER_TOKEN}:${payload.userId}`
    const redisToken = await this.redisService.get(ADMIN_USER_TOKEN_KEY)
    if (!redisToken) throw new JsonWebTokenError('Token 无效或已过期')
    await this.redisService.expire(ADMIN_USER_TOKEN_KEY, this.JWT_EXPIRESIN) // Token 续期
  }

  private handleTokenError(error: any): never {
    const isJwtError = error instanceof JsonWebTokenError || error.name === 'TokenExpiredError'
    if (isJwtError) throw new ApiException('您的会话已过期或尚未登录，请重新登录', HttpStatus.UNAUTHORIZED)
    throw new ApiException(error.message || '未知错误，请联系管理员', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
