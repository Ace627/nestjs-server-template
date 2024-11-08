import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { LoginService } from './login.service'
import { LoginParameterDto } from './login.dto'
import { AllowNoToken } from '@/common'

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /** 获取登录验证码 */
  @Get('captcha')
  @AllowNoToken()
  getCaptcha(@Query('type') type: CaptchaType) {
    return this.loginService.getCaptcha(type)
  }

  /** 用户登录 */
  @Post('login')
  @AllowNoToken()
  login(@Body() loginParams: LoginParameterDto) {
    return loginParams
  }

  /** 用户登出 */
  @Post('logout')
  @AllowNoToken()
  logout() {
    return '退出成功'
  }
}
