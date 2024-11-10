import { Injectable } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  private readonly redisClient: RedisClientType

  constructor() {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD: password } = process.env
    this.redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}`, password })
    this.redisClient.connect()
  }

  /** 设置值 过期时间秒 */
  set(key: string, value: any, expire: number) {
    value = JSON.stringify(value)
    return this.redisClient.set(key, value, { EX: expire })
  }

  /** 获取值 */
  async get(key: string) {
    let value = await this.redisClient.get(key)
    try {
      value = JSON.parse(value)
    } catch (error) {}
    return value
  }

  /** 删除值 */
  del(key: string) {
    return this.redisClient.del(key)
  }

  /** 续期 */
  expire(key: string, expire: number) {
    return this.redisClient.expire(key, expire)
  }

  /** 清空缓存 */
  flushAll() {
    return this.redisClient.flushAll()
  }
}
