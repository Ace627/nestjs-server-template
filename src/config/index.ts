/** http://nestjs.inode.club/techniques/configuration#自定义环境文件路径 */
export const envFilePath = [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, `.env`]

export { configuration } from './configuration'
export { setupSwagger } from './swagger.config'
