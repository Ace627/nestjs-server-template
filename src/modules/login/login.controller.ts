import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common'
import { LoginService } from './login.service'
import { LoginParamsDto } from './login.dto'
import { AllowNoToken, AuthEnum } from '@/common'

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
  login(@Body() loginParams: LoginParamsDto) {
    return this.loginService.login(loginParams)
  }

  /** 获取个人信息 */
  @Get('getInfo')
  getInfo(@Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    return this.loginService.getInfo(payload.id)
  }

  /** 用户登出 */
  @Post('logout')
  @AllowNoToken()
  logout(@Headers('authorization') authorization: string) {
    if (!authorization) return '退出成功'
    const token = authorization.split(' ')[1]
    return this.loginService.logout(token)
  }
}
