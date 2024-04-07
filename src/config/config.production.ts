/**
 * @description 正式环境配置文件
 */
import { defineConfig } from './defineConfig'

export default defineConfig({
  port: 12345,

  captchaTimeout: 300,
})
