import { Injectable } from '@nestjs/common'
import { CaptchaUtil } from '@/utils/captcha.util'
import { RedisService } from '@/shared/redis.service'
import { CAPTCHA_IMG_KEY } from '@/common/constant/redis.constant'

@Injectable()
export class LoginService {
  constructor(private readonly redisService: RedisService) {}

  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    await this.redisService.set(`${CAPTCHA_IMG_KEY}:${uuid}`, text, 60)
    return { uuid, captcha }
  }
}
