/** 判断系统是否是开发环境 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/** 根据环境变量判断使用配置 */
export default () => {
  let envConfig: IConfig = {}
  try {
    envConfig = require(`./config.${process.env.NODE_ENV}`).default
  } catch (error) {
    console.log('error: ', error)
  }

  return envConfig
}
