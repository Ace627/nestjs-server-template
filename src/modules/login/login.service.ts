import argon2 from 'argon2'
import { omit } from 'lodash'
import { ApiException } from '@/common'
import { JwtService } from '@nestjs/jwt'
import { HttpCode, HttpStatus, Injectable } from '@nestjs/common'
import { LoginParamsDto } from './login.dto'
import { UserService } from '../user/user.service'
import { CaptchaUtil } from '@/utils/captcha.util'
import { RedisService } from '@/shared/redis.service'
import { CAPTCHA_IMG_KEY, USER_ACCESS_TOKEN_KEY } from '@/common/constant/redis.constant'
import { RoleService } from '../role/role.service'

@Injectable()
export class LoginService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly roleSerivce: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  /** 获取登录验证码 */
  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    await this.redisService.set(`${CAPTCHA_IMG_KEY}:${uuid}`, text, 60)
    return { uuid, captcha }
  }

  /** 用户登录 */
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

  /** 获取个人权限信息 */
  async getInfo(userId: string) {
    // 根据 ID 获取单个用户
    const userInfo = await this.userService.findOneById(userId)
    if (userInfo.status === 0) throw new ApiException('您的账号已被停用，请联系管理员', HttpStatus.FORBIDDEN)
    // 根据 ID 查询用户角色
    const userRoles = await this.userService.findRoles(userId)
    const isAdmin = userRoles.some((role) => role.code === 'admin')
    const roleIds = userRoles.map((role) => role.id)
    const roles = userRoles.map((role) => role.code)
    const menuInfo = await this.roleSerivce.findMenusByRoleIds(isAdmin, roleIds)
    const permissions = menuInfo.filter((v) => v.type === 'F').map((v) => v.permission)
    // 不是管理员 也没有角色 那就什么动态路由都看不到呗
    const menus = isAdmin || roleIds.length ? menuInfo.filter((v) => ['M', 'C'].includes(v.type)) : []
    return { userInfo, roles, menus, permissions }
  }

  /** 用户登出 */
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
