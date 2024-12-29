import { ConfigEnum } from '@/common'
import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export function jwtFactory(configService: ConfigService): JwtModuleOptions {
  const config: JwtModuleOptions = {}
  config.signOptions = {}
  const { secret } = configService.get<JwtConfig>(ConfigEnum.JWT)
  config.secret = secret // 生成 Token 的密钥
  config.signOptions.expiresIn = 24 * 60 * 60 // 前端本地存储的 Token 的过期时间
  return config
}
