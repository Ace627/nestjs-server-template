import argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginAccountDto } from './login.dto'
import { ConfigService } from '@nestjs/config'
import { ApiException, ConfigEnum, RedisKey } from '@/common'
import { RedisService } from '@/shared/redis.service'
import { UserService } from '../system/user/user.service'
import { CaptchaService } from '@/shared/captcha.service'

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly captchaService: CaptchaService,
  ) {}

  /** 获取图片验证码 */
  public async getCaptcha() {
    return this.captchaService.generate()
  }

  /** 用户登录 */
  public async login(loginDto: LoginAccountDto) {
    // 校验验证码 & 通过验证后需删除缓存的键值
    await this.captchaService.validate(loginDto.uuid, loginDto.captcha)
    // 校验账号密码 错误统一返回账号或密码错误 加强安全性
    const user = await this.userService.findUserByUsername(loginDto.username)
    const isRightPwd = await argon2.verify(user.password, loginDto.password)
    if (!isRightPwd) throw new ApiException('账号或密码错误，请检查后重试')
    // 准备 Jwt 载荷 并生成 Token
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { userId: user.id, username: user.username }
    const accessToken = this.jwtService.sign(payload)
    // 生成的 AdminToken 缓存到 Redis
    const ADMIN_USER_TOKEN_KEY = RedisKey.getAdminUserTokenKey(payload.userId)
    await this.redisService.set(ADMIN_USER_TOKEN_KEY, accessToken, this.configService.get<number>(ConfigEnum.JWT_EXPIRESIN))
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
