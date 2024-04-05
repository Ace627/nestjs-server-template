import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { LoginService } from './login.service'
import { CreateLoginDto } from './dto/create-login.dto'
import { UpdateLoginDto } from './dto/update-login.dto'
import { Public } from '@/common/decorators/public.decorator'

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /* 获取图片验证码 */
  @Public()
  @Get('captcha')
  getCaptcha() {
    return this.loginService.createCaptchaImage()
  }

  /** 用户登录 */
  @Public()
  @Post('login')
  login() {
    return this.loginService.login()
  }

  /** 获取用户信息 */
  @Get('login')
  getInfo() {
    return this.loginService.getInfo()
  }

  /** 获取用户路由信息 */
  @Get('getRoutes')
  getRoutes() {
    return this.loginService.getRoutes()
  }

  /* 退出登录 */
  @Public()
  @Post('logout')
  logout() {
    return this.loginService.logout()
  }
}
