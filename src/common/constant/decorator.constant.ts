export class DecoratorKey {
  /** 不需要 Jwt 校验 */
  static PUBLIC = 'common:decorator:public'

  /** 响应数据不包装直接返回 */
  static RAW = 'common:decorator:raw'
}
