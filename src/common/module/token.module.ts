import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '../enum/config.enum'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        // 获取 Jwt 相关的环境变量配置
        const runtimeConfig = configService.get<JwtConfig>(ConfigEnum.JWT)
        return {
          // 必须的密钥，用于签名和验证 JWT
          secret: runtimeConfig.secret,

          // 签名选项
          signOptions: {
            // 设置 Token 的过期时间，单位为秒 这里设为 24 小时：24 * 60 * 60
            expiresIn: 24 * 60 * 60,
          },
        }
      },
      // 设置该模块为全局模块，避免在每个模块中重复导入
      global: true,

      // 指定注入 ConfigService 作为依赖
      inject: [ConfigService],
    }),
  ],
})
export class TokenModule {}
