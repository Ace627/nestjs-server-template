import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiException, ConfigEnum, Raw } from './common'
import { ConfigService } from '@nestjs/config'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log('__filename: ', __filename)
    console.log('__dirname: ', __dirname)
    console.log(this.configService.get<JwtConfig>(ConfigEnum.JWT))
    console.log(this.configService.get<JwtConfig>(ConfigEnum.JWT_EXPIRESIN))
    console.log(this.configService.get<RedisConfig>(ConfigEnum.REDIS))
    return this.appService.getHello()
  }
}
