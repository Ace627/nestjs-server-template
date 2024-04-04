import { INestApplication } from '@nestjs/common'
import helmetMiddleware from './helmet.middleware'

/**
 * @description 此文件用来统一注册项目中所使用的各种中间件，方便管理和配置
 */
export const registerMiddleWare = (app: INestApplication) => {
  /** Helmet 通过设置各种 HTTP 请求头，提升 Express 应用的安全性 */
  app.use(helmetMiddleware)
}
