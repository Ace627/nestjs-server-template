import { SetMetadata } from '@nestjs/common'
import { DecoratorKey } from '../constant/decorator.constant'

/**
 * 响应数据不包装直接返回
 */
export function Raw() {
  return SetMetadata(DecoratorKey.RAW, true)
}
