import { Injectable } from '@nestjs/common'
import { CaptchaUtil } from '@/utils/captcha.util'
import { RedisService } from '@/shared/redis.service'

@Injectable()
export class LoginService {
  constructor(private readonly redisService: RedisService) {}

  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    await this.redisService.set(`captcha:${uuid}`, text, 60)
    return { uuid, captcha }
  }
}
