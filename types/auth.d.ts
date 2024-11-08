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

type TableQueryParams<T = any> = T & { take: number; skip: number }
