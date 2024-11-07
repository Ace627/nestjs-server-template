import pkg from '../package.json'
import { knife4jSetup } from 'nestjs-knife4j2'
import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, type SwaggerDocumentOptions } from '@nestjs/swagger'

const { name, author, version, description } = pkg

export async function setupSwagger(app: INestApplication) {
  // 初始化文档配置项
  const documentBuilder = new DocumentBuilder()
  documentBuilder.setTitle(name)
  documentBuilder.setVersion(version)
  documentBuilder.setContact(author, '', '1207588603@qq.com')
  documentBuilder.addTag('文档概览') // 左侧生成一个和主页同样功能的菜单，无法去除，属实恶心
  documentBuilder.setBasePath('/api')
  documentBuilder.setDescription(description)

  // 配置文档的额外选项
  const options: SwaggerDocumentOptions = {}
  // 确保库生成的操作名称为 createUser 而不是 UserController_createUser
  options.operationIdFactory = (controllerKey: string, methodKey: string) => methodKey
  const config = documentBuilder.build()

  // 根据设定的配置项生成文档数据
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('doc', app, document)

  // 采用 knife4 类管理后台版 UI
  knife4jSetup(app, [{ name: name, swaggerVersion: version, url: `/doc-json`, location: `/doc-json` }])
}
