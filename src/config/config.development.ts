/**
 * @description 测试环境配置文件
 */
import { defineConfig } from './defineConfig'

export default defineConfig({
  SERVER_PORT: 3000,

  SERVER_CAPTCHA_TIMEOUT: 300,

  SERVER_DB_TYPE: 'mysql',
  SERVER_DB_HOST: '127.0.0.1',
  SERVER_DB_PORT: 3306,
  SERVER_DB_NAME: 'admin',
  SERVER_DB_USERNAME: 'admin',
  SERVER_DB_PASSWORD: 'afrgty',
  SERVER_DB_AUTOLOAD: true,
})
