import { Public } from '@/common'
import { LoginAccountDto } from './login.dto'
import { LoginService } from './login.service'
import { Body, Controller, Get, Post, Headers } from '@nestjs/common'

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /** 获取图片验证码 */
  @Public()
  @Get('captcha')
  public getCaptcha() {
    return this.loginService.getCaptcha()
  }

  /** 用户登录 */
  @Public()
  @Post('login')
  public login(@Body() loginDto: LoginAccountDto) {
    return this.loginService.login(loginDto)
  }

  /** 退出登录 */
  @Public()
  @Post('logout')
  public logout(@Headers('authorization') authorization: string) {
    if (!authorization) return '退出成功'
    const token = authorization.split(' ')[1]
    return this.loginService.logout(token)
  }
}
