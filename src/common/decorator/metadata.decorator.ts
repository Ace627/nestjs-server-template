import { SetMetadata } from '@nestjs/common'
import { DecoratorKey } from './decorator-key'

/** 设置不进行 jwt 校验 */
export const AllowNoToken = () => SetMetadata(DecoratorKey.ALLOW_NO_TOKEN, true)

/** 设置不进行响应数据的结构包装 */
export const AllowNoTransform = () => SetMetadata(DecoratorKey.ALLOW_NO_TRANSFORM, true)
