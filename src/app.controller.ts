import { Controller, Get } from '@nestjs/common'
import { ApiException, ConfigEnum, Raw } from './common'
import { ConfigService } from '@nestjs/config'
import { RedisService } from './shared/redis.service'

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  @Raw()
  @Get()
  async test() {
    const problems = [
      { problem: '测试 Redis 获取不存在的值', answer: await this.redisService.get('aedfg') },
      { problem: '测试 Redis 给不存在的值延长时间', answer: await this.redisService.expire('wefgh', 3000) },
      { problem: '测试 __filename 变量的值', answer: __filename },
      { problem: '测试 __dirname 变量的值', answer: __dirname },
      { problem: '测试 server 环境变量的配置', answer: JSON.stringify(this.configService.get<ServerConfig>(ConfigEnum.SERVER)) },
      { problem: '测试直接获取 jwt 的深层配置', answer: this.configService.get<number>(ConfigEnum.JWT_EXPIRESIN) },
    ]
    return problems
  }
}
