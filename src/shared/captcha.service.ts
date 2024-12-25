import crypto from 'crypto'
import svgCaptcha from 'svg-captcha'
import { Injectable } from '@nestjs/common'
import { RedisService } from './redis.service'
import { RedisKey, ApiException } from '@/common'

@Injectable()
export class CaptchaService {
  constructor(private readonly redisService: RedisService) {}

  /** 生成算数验证码 */
  public async generate(): Promise<{ uuid: string; captcha: string }> {
    const uuid = crypto.randomUUID().replaceAll('-', '').toLowerCase()
    const { data, text } = svgCaptcha.createMathExpr({ background: '#C0C8BE', noise: 4 })
    const captcha = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    await this.redisService.set(RedisKey.getCaptchaKey(uuid), text, 3 * 60)
    return { uuid, captcha }
  }

  /** 校验验证码 */
  public async validate(uuid: string, text: string): Promise<boolean> {
    const CAPTCHA_KEY = RedisKey.getCaptchaKey(uuid)
    const CAPTCHA_CACHE_VALUE = await this.redisService.get(CAPTCHA_KEY)
    if (text !== CAPTCHA_CACHE_VALUE) throw new ApiException('验证码错误，请刷新后重试')
    await this.redisService.del(CAPTCHA_KEY)
    return true
  }
}
