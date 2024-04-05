import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { InjectRedis } from '@nestjs-modules/ioredis'
import svgCaptcha from 'svg-captcha'
import { SharedService } from '@/shared/shared.service'
import { RedisEnum } from '@/enums/redis.enum'

@Injectable()
export class LoginService {
  constructor(private readonly sharedService: SharedService, private readonly configService: ConfigService, @InjectRedis() private readonly redisService: Redis) {}

  /* 创建验证码图片 */
  async createCaptchaImage() {
    const { data, text } = svgCaptcha.createMathExpr({ noise: 3, background: '#F2FDFF', width: 120, height: 40 })
    const uuid = this.sharedService.randomUUID()
    const expireIn = this.configService.get<number>('SERVER_CAPTCHA_TIMEOUT', 300)
    await this.redisService.set(`${RedisEnum.CAPTCHA_IMG_KEY}:${uuid}`, text, 'EX', expireIn)
    return { uuid, captcha: data }
  }

  /** 用户登录 */
  async login() {
    return '用户登录成功'
  }

  /** 获取用户信息 */
  async getInfo() {
    return '获取用户信息成功'
  }

  /** 获取用户路由信息 */
  async getRoutes() {
    return '获取用户路由信息成功'
  }

  /** 退出登录 */
  async logout() {
    return '退出登录成功'
  }
}
