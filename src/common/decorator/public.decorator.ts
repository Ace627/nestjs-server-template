import { SetMetadata } from '@nestjs/common'
import { DecoratorKey } from '../constant/decorator.constant'

/**
 * 指定当前接口不需要 Token 鉴权
 */
export function Public() {
  return SetMetadata(DecoratorKey.PUBLIC, true)
}
