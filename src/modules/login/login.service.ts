import svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginAccountDto } from './login.dto'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '@/shared/redis.service'
import { ApiException, ConfigEnum, RedisKey } from '@/common'

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
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
    await this.redisService.set(`${RedisKey.CAPTCHA_IMG}:${uuid}`, text, 2 * 60)
    return { uuid, captcha }
  }

  /**
   * 用户登录
   */
  public async login(loginDto: LoginAccountDto) {
    // 校验验证码 & 通过验证后需删除缓存的键值
    const CAPTCHA_KEY = `${RedisKey.CAPTCHA_IMG}:${loginDto.uuid}`
    const CAPTCHA_CACHE_VALUE = await this.redisService.get(CAPTCHA_KEY)
    if (loginDto.captcha !== CAPTCHA_CACHE_VALUE) throw new ApiException('验证码错误，请刷新后重试')
    await this.redisService.del(CAPTCHA_KEY)

    // 准备 Jwt 载荷 并生成 Token
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { userId: '1adf', username: 'admin' }
    const accessToken = this.jwtService.sign(payload)

    // 生成的 AdminToken 缓存到 Redis
    const JWT_EXPIRESIN = this.configService.get<number>(ConfigEnum.JWT_EXPIRESIN)
    const ADMIN_USER_TOKEN_KEY = `${RedisKey.ADMIN_USER_TOKEN}:${payload.userId}`
    await this.redisService.set(ADMIN_USER_TOKEN_KEY, accessToken, JWT_EXPIRESIN)
    return { accessToken }
  }

  /**
   * 退出登录
   */
  public async logout(token: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(token)
      await this.redisService.del(`${RedisKey.ADMIN_USER_TOKEN}:${payload.userId}`)
    } catch (error) {}
    return `退出登录成功`
  }
}
