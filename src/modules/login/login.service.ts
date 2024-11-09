import { Injectable } from '@nestjs/common'
import { CaptchaUtil } from '@/utils/captcha.util'
import { RedisService } from '@/shared/redis.service'
import { CAPTCHA_IMG_KEY } from '@/common/constant/redis.constant'
import { UserService } from '../user/user.service'
import { LoginParamsDto } from './login.dto'
import { ApiException } from '@/common'
import argon2 from 'argon2'

@Injectable()
export class LoginService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    await this.redisService.set(`${CAPTCHA_IMG_KEY}:${uuid}`, text, 60)
    return { uuid, captcha }
  }

  async login(loginParams: LoginParamsDto) {
    const captcha_key = `${CAPTCHA_IMG_KEY}:${loginParams.uuid}`
    const text = await this.redisService.get(captcha_key)
    if (!text) throw new ApiException(`验证码错误`)
    const user = await this.userService.findOneByUsername(loginParams.username)
    if (!user) throw new ApiException(`用户名或密码错误`)
    const valid = await argon2.verify(user.password, loginParams.password)
    if (!valid) throw new ApiException(`用户名或密码错误`)
    await this.redisService.del(captcha_key)
  }
}
