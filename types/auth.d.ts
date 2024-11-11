/** 验证码生成结果 */
interface Captcha {
  /** 验证码的答案 */
  text: string
  /** 验证码的唯一标识符 */
  uuid: string
  /** base64 格式的验证码图片 */
  captcha: string
}

/** 验证码类型 */
type CaptchaType = 'string' | 'math'

interface JwtPayload {
  /** 用户 id */
  id: string
  /** 用户账号 */
  username: string
  /** 签名签发时间戳 */
  iat?: number
}
