/**
 * @description 全局错误拦截器
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import type { Response } from 'express'
import { ApiException } from '@/common/exceptions/api.exception'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp() // 获取请求上下文
    const response = context.getResponse<Response>() // 获取请求上下文中的 response 对象
    const { status, message, code } = this._handleException(exception)
    response.status(status)
    response.json({ code, success: false, message, timestamp: Date.now() })
  }
  /* 解析错误类型，获取状态码和返回值 */
  private _handleException(exception: unknown) {
    const isHttpException = exception instanceof HttpException
    const isApiException = exception instanceof ApiException
    let status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR // 获取错误状态码
    const code = isApiException ? exception.getCode() : status
    let message = exception // 获取处理异常信息
    if (isHttpException) {
      const response = exception.getResponse()
      message = (response as any).message ?? response
    }
    if (exception instanceof ThrottlerException) {
      status = HttpStatus.OK
      message = `您的请求过于频繁，请稍后再试`
    }
    return { status, message, code }
  }
}
