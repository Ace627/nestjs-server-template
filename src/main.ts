import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await app.listen(3000)

  Logger.verbose(`Node Server is running at http://localhost:3000`)
}
bootstrap()
