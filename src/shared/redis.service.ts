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

  /** 设置缓存（支持过期时间） 如果不传递 ttl，则是永久缓存 */
  public set(key: string, value: string, ttl?: number) {
    ttl ? this.redisClient.setEx(key, ttl, value) : this.redisClient.set(key, value)
  }

  /** 延长指定 key 的过期时间（单位：秒） */
  public expire(key: string, ttl: number): Promise<boolean> {
    return this.redisClient.expire(key, ttl)
  }

  /** 获取缓存 */
  public get(key: string): Promise<string | null> {
    return this.redisClient.get(key)
  }

  /** 删除缓存 */
  public del(key: string) {
    this.redisClient.del(key)
  }

  /** 检查缓存是否存在 */
  public async exists(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) === 1 // Redis 返回 1 表示存在，0 表示不存在
  }

  /** 清空缓存 */
  public flushAll() {
    this.redisClient.flushAll()
  }

  /** 关闭 Redis 连接 */
  public quit() {
    this.redisClient.quit()
  }
}
