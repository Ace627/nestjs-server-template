import { CaptchaUtil } from '@/utils/captcha.util'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  async getCaptcha() {
    const { text, uuid, captcha } = await CaptchaUtil.createCaptcha()
    return { uuid, captcha }
  }
}
