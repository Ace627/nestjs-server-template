/**
 * 人的性别的代码枚举 标准号：GB/T 2261.1-2003
 * 参考：http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=0FC942D542BC6EE3C707B2647EF81CD8
 */
export enum GenderEnum {
  /** 未知的性别 */
  UNKNOWN = 0,
  /** 男性 */
  MALE = 1,
  /** 女性 */
  FEMALE = 2,
}

/** Jwt 相关配置 */
export enum AuthEnum {
  /**
   * Token 校验通过后挂载到 Header 的 key
   */
  PAYLOAD = 'payload',

  /**
   * Token 前缀常量，用于从请求头中提取 Bearer Token
   */
  TOKEN_PREFIX = 'Bearer',
}
