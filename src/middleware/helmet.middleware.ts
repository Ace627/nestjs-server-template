import helmet from 'helmet'

/**
 * Helmet 是一个用于增强 Express 应用程序安全性的中间件。
 * 它通过设置 HTTP 头部来增加安全性，包括防止常见的攻击，如跨站点脚本（XSS）攻击、点击劫持等。
 */

export default helmet({
  /** 取消 https 强制转换 */
  contentSecurityPolicy: false,
})
