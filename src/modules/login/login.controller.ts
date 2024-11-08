import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { LoginService } from './login.service'
import { LoginParameterDto } from './login.dto'
import { AllowNoToken } from '@/common'

@ApiTags('登录模块')
@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('captcha')
  @AllowNoToken()
  @ApiOperation({ summary: '获取验证码' })
  @ApiQuery({ name: 'type', type: 'string', description: '验证码类型', enum: ['string', 'math'], required: false, default: 'string' })
  getCaptcha(@Query('type') type: CaptchaType) {
    return this.loginService.getCaptcha(type)
  }

  @Post('login')
  @AllowNoToken()
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginParameterDto, description: '登录所需参数' })
  login(@Body() loginParams: LoginParameterDto) {
    return loginParams
  }

  @Post('logout')
  @AllowNoToken()
  @ApiOperation({ summary: '用户登出' })
  logout() {
    return '退出成功'
  }
}
