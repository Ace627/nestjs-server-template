import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { registerMiddleWare } from './middleware'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** 解构环境变量 */
  const configService = app.get(ConfigService)
  const port = configService.get<number>('port', 3000)

  /** 统一注册项目所用的中间件 */
  registerMiddleWare(app)

  /** 监听服务端口 */
  await app.listen(port)

  /** 打印本地服务地址 */
  Logger.verbose(`Node Server is running at http://localhost:${port}`)
}
bootstrap()
