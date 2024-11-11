import argon2 from 'argon2'
import { omit } from 'lodash'
import { ApiException } from '@/common'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginParamsDto } from './login.dto'
import { UserService } from '../user/user.service'
import { CaptchaUtil } from '@/utils/captcha.util'
import { RedisService } from '@/shared/redis.service'
import { CAPTCHA_IMG_KEY, USER_ACCESS_TOKEN_KEY } from '@/common/constant/redis.constant'

@Injectable()
export class LoginService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description 获取登录验证码
   * @param {CaptchaType} type string 图形验证码 math 算数验证码
   */
  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    await this.redisService.set(`${CAPTCHA_IMG_KEY}:${uuid}`, text, 60)
    return { uuid, captcha }
  }

  /**
   * @description 用户登录
   * @param {LoginParamsDto} loginParams 登录所需要的参数体
   */
  async login(loginParams: LoginParamsDto) {
    const captchaKey = `${CAPTCHA_IMG_KEY}:${loginParams.uuid}`
    const text = await this.redisService.get(captchaKey)
    if (!text) throw new ApiException(`验证码错误`)
    const user = await this.userService.findOneByUsername(loginParams.username)
    if (!user) throw new ApiException(`登录账号不存在或已停用`)
    const valid = await argon2.verify(user.password, loginParams.password)
    if (!valid) throw new ApiException(`用户名或密码错误`)
    await this.redisService.del(captchaKey)
    const payload: JwtPayload = { id: user.id, username: user.username }
    const accessToken = await this.jwtService.signAsync(payload)
    await this.redisService.set(`${USER_ACCESS_TOKEN_KEY}:${user.id}`, accessToken, +process.env.JWT_ACCESS_TIMEOUT)
    return { accessToken }
  }

  /**
   * 获取个人信息
   * @param {string} userId 用户 ID 标识
   */
  async getInfo(userId: string) {
    const user = await this.userService.findOneById(userId)
    const roles = user.roles.map((role) => role.code)
    const userInfo = omit(user, ['roleIds', 'roles'])
    return { userInfo, roles }
  }

  /**
   * 用户登出
   * @param {string} token
   */
  async logout(token: string) {
    try {
      const payload = await this.jwtService.verify(token)
      await this.redisService.del(`${USER_ACCESS_TOKEN_KEY}:${payload.id}`)
      return `退出成功`
    } catch (error) {
      return `退出失败`
    }
  }
}
