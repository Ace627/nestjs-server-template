import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export const TableQuery = createParamDecorator((_: any, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  const originQuery = request.query
  console.log('originQuery: ', originQuery)
  const pageNo = originQuery.pageNo ? +originQuery.pageNo : 1
  const pageSize = originQuery.pageSize ? +originQuery.pageSize : 10
  const skip: number = (pageNo - 1) * pageSize
  const take: number = pageSize
  const query = { pageNo, pageSize, skip, take }
  return { ...originQuery, ...query }
})
