import { Injectable } from '@nestjs/common'
import { CreateLoginDto } from './dto/create-login.dto'
import { UpdateLoginDto } from './dto/update-login.dto'

@Injectable()
export class LoginService {
  /* 获取图片验证码 */
  createCaptchaImage() {
    return '验证码获取成功'
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
