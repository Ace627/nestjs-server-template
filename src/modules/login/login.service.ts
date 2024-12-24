import { Injectable } from '@nestjs/common'
import { LoginAccountDto } from './login.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  public async login(loginDto: LoginAccountDto) {
    const accessToken = this.jwtService.sign({ ...loginDto })
    return { accessToken }
  }
}
