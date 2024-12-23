import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { ConfigEnum } from './common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 读取环境变量配置
  const configService = app.get(ConfigService)
  const { port, globalPrefix } = configService.get<ServerConfig>(ConfigEnum.SERVER)

  // 设置全局接口前缀
  app.setGlobalPrefix(globalPrefix)

  // 监听指定 启动服务
  await app.listen(port)

  // 打印本地服务地址
  console.log('\n--------------------------------------------------')
  console.log(`➜  Local:    http://localhost:${port}${globalPrefix}`)
  console.log('--------------------------------------------------')
}

bootstrap()
