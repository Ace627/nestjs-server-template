import { Public } from '@/common'
import { LoginAccountDto } from './login.dto'
import { LoginService } from './login.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post('login')
  public login(@Body() loginDto: LoginAccountDto) {
    return this.loginService.login(loginDto)
  }
}
