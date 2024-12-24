export enum AuthEnum {
  /** Token 校验通过后挂载到 Header 的 key */
  PAYLOAD = 'payload',

  /** Token 前缀常量，用于从请求头中提取 Bearer Token */
  TOKEN_PREFIX = 'Bearer',
}
