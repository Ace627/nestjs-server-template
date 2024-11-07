import { NestFactory } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { SharedService } from './shared/shared.service'
import { IpUtil } from './utils/ip.util'
import { registerMiddleWare } from './middleware'
import { setupSwagger } from './swagger.config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 从 NestJS 应用上下文中获取所需服务类的实例，以便使用这个实例来调用该服务中定义的方法和属性
  const sharedService = app.get(SharedService)

  // 配置全局路由前缀
  app.setGlobalPrefix('/api')

  // 配置静态资源目录
  app.useStaticAssets(sharedService.pathResolve('public'), {
    prefix: '/public/',
    setHeaders(res, path, stat) {
      res.header('Access-Control-Allow-Origin', '*') // 设置跨域头部
      res.header('Access-Control-Allow-Methods', 'GET')
    },
  })

  // 统一注册项目所用的中间件
  registerMiddleWare(app)

  // 配置 Swagger 接口文档
  setupSwagger(app)

  // 监听服务端口
  await app.listen(process.env.PORT ?? 3000)

  // 打印本地服务地址
  console.log(await app.getUrl())
  console.log('\n--------------------------------------------------')
  console.log(`➜  Local:    http://127.0.0.1:3000/api`)
  console.log(`➜  Swagger:  http://127.0.0.1:3000/doc`)
  console.log('--------------------------------------------------')
}

bootstrap()
