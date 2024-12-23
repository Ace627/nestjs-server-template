import { ConfigEnum } from '@/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  private readonly redisClient: RedisClientType

  constructor(private readonly configService: ConfigService) {
    this.redisClient = createClient(this.configService.get<RedisConfig>(ConfigEnum.REDIS))
    this.redisClient.connect()
  }
}
