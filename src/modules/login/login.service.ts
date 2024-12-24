import svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginAccountDto } from './login.dto'
import { RedisService } from '@/shared/redis.service'
import { ApiException, RedisKey } from '@/common'

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  public async getCaptcha() {
    const uuid = crypto.randomUUID().replaceAll('-', '').toLowerCase()
    const { data, text } = svgCaptcha.createMathExpr({ background: '#C0C8BE', noise: 4 })
    const captcha = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    await this.redisService.set(`${RedisKey.CAPTCHA_IMG}:${uuid}`, text, 60)
    return { uuid, captcha }
  }

  public async login(loginDto: LoginAccountDto) {
    // 校验验证码 & 通过验证后需删除缓存的键值
    const CAPTCHA_KEY = `${RedisKey.CAPTCHA_IMG}:${loginDto.uuid}`
    const CAPTCHA_CACHE_VALUE = await this.redisService.get(CAPTCHA_KEY)
    if (loginDto.captcha !== CAPTCHA_CACHE_VALUE) throw new ApiException('验证码错误，请刷新后重试')
    await this.redisService.del(CAPTCHA_KEY)

    // 准备 Jwt 载荷 并生成 Token 然后存到缓存 Redis
    const accessToken = this.jwtService.sign({ ...loginDto })
    return { accessToken }
  }
}
