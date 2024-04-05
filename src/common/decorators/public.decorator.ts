import { DecoratorEnum } from '@/enums/decorator.enum'
import { SetMetadata } from '@nestjs/common'

/** 设置不进行 jwt 校验 */
export const Public = () => SetMetadata(DecoratorEnum.PUBLIC_KEY, true)
