export class DecoratorKey {
  /** 不需要 Jwt 校验 */
  static PUBLIC = 'common:decorator:public'

  /** 响应数据不包装直接返回 */
  static RAW = 'common:decorator:raw'

  /** 自动添加 createBy 与 updateBy 的信息 */
  static AUTO_AUDIT = 'common:decorator:auto-audit'
}
