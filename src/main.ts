import { join } from 'path'
import { ConfigEnum } from './common'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { type NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 读取环境变量配置
  const configService = app.get(ConfigService)
  const { port, globalPrefix, staticAssetsPath, baseViewsDir } = configService.get<ServerConfig>(ConfigEnum.SERVER)

  // 设置全局接口前缀
  app.setGlobalPrefix(globalPrefix)

  // 配置静态资源目录
  const staticAssetsPathPrefix = staticAssetsPath.replace(/(\.\.\/|\.\/)/g, '/').replace(/\/+$/, '') + '/'
  app.useStaticAssets(join(__dirname, staticAssetsPath), { prefix: staticAssetsPathPrefix })

  // 配置模板引擎
  app.setBaseViewsDir(join(__dirname, baseViewsDir))
  app.setViewEngine('hbs')

  // 监听指定 启动服务
  await app.listen(port)

  // 打印本地服务地址
  console.log('\n--------------------------------------------------')
  console.log(`➜  Local:    http://localhost:${port}${globalPrefix}`)
  console.log(`➜  Static:   http://localhost:${port}/public`)
  console.log('--------------------------------------------------')
}

bootstrap()
