import crypto from 'crypto'
import svgCaptcha from 'svg-captcha'

/**
 * 图片验证码生成服务类
 *  - https://github.com/produck/svg-captcha/blob/1.x/README_CN.md
 */
export class CaptchaUtil {
  /**
   * 获取验证码配置对象，可自定义配置参数来覆盖默认配置
   * @param {svgCaptcha.ConfigObject} config  自定义配置对象，可选。用户可以传入指定参数来覆盖默认配置
   * @returns {svgCaptcha.ConfigObject} 返回包含最终配置的对象，将自定义配置与默认配置合并后返回
   */
  private static _captchaConfig(config: svgCaptcha.ConfigObject = {}): svgCaptcha.ConfigObject {
    const defaultConfig: svgCaptcha.ConfigObject = {
      noise: 3, // 噪点数量，增强验证码复杂性
      background: '#F2FDFF', // 背景色为浅蓝色
      width: 120, // 验证码宽度
      height: 40, // 验证码高度
    }
    // 返回合并默认配置和自定义配置后的最终配置
    return { ...defaultConfig, ...config }
  }

  /**
   * 生成一个数学验证码（数学运算题），并返回验证码的相关信息
   *  - `text` {string} - 验证码的数学题答案，用于验证
   *  - `uuid` {string} - 唯一的标识符，用于匹配验证码
   *  - `captcha` {string} - 验证码的 SVG 图片，经过 base64 编码，以 `data:image/svg+xml;base64,` 开头
   */
  static async createMathCaptcha(): Promise<Captcha> {
    // 生成一个带数学表达式的 SVG 验证码，指定了噪点、背景色、宽度和高度
    const { data, text } = svgCaptcha.createMathExpr(this._captchaConfig())
    // 将生成的 SVG 验证码数据编码为 base64 格式，便于在网页中展示
    const captcha = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    //使用 crypto.randomUUID() 生成一个唯一标识符，用于追踪验证码
    const uuid = crypto.randomUUID()
    // 返回包含验证码信息的对象
    return { text, uuid, captcha }
  }

  /**
   * 生成指定个数字符的图片验证码
   */
  static async createCaptcha() {
    const { data, text } = svgCaptcha.create(this._captchaConfig())
    const captcha = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
    const uuid = crypto.randomUUID()
    return { text, uuid, captcha }
  }
}
