import pkg from '../package.json'
import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, type SwaggerDocumentOptions } from '@nestjs/swagger'

export async function setupSwagger(app: INestApplication) {
  // 初始化文档配置项
  const documentBuilder = new DocumentBuilder()
  documentBuilder.setTitle(pkg.name)
  documentBuilder.setVersion(pkg.version)
  documentBuilder.setDescription(pkg.description)

  // 配置文档的额外选项
  const options: SwaggerDocumentOptions = {}
  // 确保库生成的操作名称为 createUser 而不是 UserController_createUser
  options.operationIdFactory = (controllerKey: string, methodKey: string) => methodKey
  const config = documentBuilder.build()

  // 根据设定的配置项生成文档数据
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('doc', app, document)
}
