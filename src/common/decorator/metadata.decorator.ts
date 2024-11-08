import { SetMetadata } from '@nestjs/common'
import { ALLOW_NO_TOKEN, ALLOW_NO_TRANSFORM } from '@/common/constant/decorator.constant'

/** 不需要 Jwt 校验 */
export const AllowNoToken = () => SetMetadata(ALLOW_NO_TOKEN, true)

/** 响应数据不包装直接返回 */
export const AllowNoTransform = () => SetMetadata(ALLOW_NO_TRANSFORM, true)
