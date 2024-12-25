import crypto from 'crypto'
import argon2 from 'argon2'
import svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginAccountDto } from './login.dto'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '@/shared/redis.service'
import { ApiException, ConfigEnum, RedisKey } from '@/common'
import { UserService } from '../system/user/user.service'

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取图片验证码
   */
  public async getCaptcha() {
    const uuid = crypto.randomUUID().replaceAll('-', '').toLowerCase()
    const { data, text } = svgCaptcha.createMathExpr({ background: '#C0C8BE', noise: 4 })
    const captcha = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    await this.redisService.set(RedisKey.getCaptchaKey(uuid), text, 2 * 60)
    return { uuid, captcha }
  }

  /**
   * 用户登录
   */
  public async login(loginDto: LoginAccountDto) {
    // 校验验证码 & 通过验证后需删除缓存的键值
    const CAPTCHA_KEY = RedisKey.getCaptchaKey(loginDto.uuid)
    const CAPTCHA_CACHE_VALUE = await this.redisService.get(CAPTCHA_KEY)
    if (loginDto.captcha !== CAPTCHA_CACHE_VALUE) throw new ApiException('验证码错误，请刷新后重试')
    await this.redisService.del(CAPTCHA_KEY)

    // 校验账号密码 错误统一返回账号或密码错误 加强安全性
    const user = await this.userService.findUserByUsername(loginDto.username)
    const isRightPwd = await argon2.verify(user.password, loginDto.password)
    if (!isRightPwd) throw new ApiException('账号或密码错误，请检查后重试')

    // 准备 Jwt 载荷 并生成 Token
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { userId: user.id, username: user.username }
    const accessToken = this.jwtService.sign(payload)

    // 生成的 AdminToken 缓存到 Redis
    const JWT_EXPIRESIN = this.configService.get<number>(ConfigEnum.JWT_EXPIRESIN)
    const ADMIN_USER_TOKEN_KEY = RedisKey.getAdminUserTokenKey(payload.userId)
    await this.redisService.set(ADMIN_USER_TOKEN_KEY, accessToken, JWT_EXPIRESIN)
    return { accessToken }
  }

  /**
   * 退出登录
   */
  public async logout(token: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(token)
      await this.redisService.del(RedisKey.getAdminUserTokenKey(payload.userId))
    } catch (error) {}
    return `退出登录成功`
  }
}
