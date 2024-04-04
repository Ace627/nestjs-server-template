import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { registerMiddleWare } from './middleware'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** 解构环境变量 */
  const configService = app.get(ConfigService)
  const SERVER_PORT = configService.get<number>('SERVER_PORT', 3000)

  /** 统一注册项目所用的中间件 */
  registerMiddleWare(app)

  await app.listen(SERVER_PORT)

  Logger.verbose(`Node Server is running at http://localhost:${SERVER_PORT}`)
}
bootstrap()
