import type { Request } from 'express'
import { AuthEnum } from '../enum/auth.enum'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Payload = createParamDecorator((_: any, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  const payload = Reflect.get(request, AuthEnum.PAYLOAD)
  return payload || {}
})
