import { SetMetadata } from '@nestjs/common'
import { PUBLIC_KEY } from '@/common/contants/decorator.contant'

/** 设置不进行 jwt 校验 */
export const Public = () => SetMetadata(PUBLIC_KEY, true)
