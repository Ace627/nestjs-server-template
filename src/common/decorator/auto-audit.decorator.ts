import { SetMetadata } from '@nestjs/common'
import { DecoratorKey } from '../constant/decorator.constant'

/**
 * 自动注入创建或更新人信息
 */
export function AutoAudit() {
  return SetMetadata(DecoratorKey.AUTO_AUDIT, true)
}
