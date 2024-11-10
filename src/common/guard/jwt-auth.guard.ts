import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from '@/shared/redis.service'
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ApiException } from '../exception/api.exception'
import { USER_ACCESS_TOKEN_KEY } from '../constant/redis.constant'
import { ALLOW_NO_TOKEN } from '../constant/decorator.constant'

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
      if (!token) throw new Error('invalid token')
      const payload = await this.jwtService.verify(token)
      const redisAccessTokenKey = `${USER_ACCESS_TOKEN_KEY}:${payload.id}`
      const redisAccessToken = await this.redisService.get(redisAccessTokenKey)
      if (!redisAccessToken) throw new Error('jwt expired')
      await this.redisService.expire(redisAccessToken, +process.env.JWT_ACCESS_TIMEOUT)
      request.headers['user'] = payload
      return true
    } catch (error) {
      // 处理 Jwt 异常
      const isJwtException = ['invalid token', 'invalid algorithm', 'jwt expired', 'jwt malformed', 'invalid signature'].includes(error.message)
      if (isJwtException) throw new ApiException(`认证失败，请登录后访问`, HttpStatus.UNAUTHORIZED)
      // 其余异常处理
      throw new ApiException(error.message || '未知异常，请联系管理员')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
