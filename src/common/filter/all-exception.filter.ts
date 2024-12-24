import type { Request, Response } from 'express'
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // 获取请求上下文
    const context = host.switchToHttp()
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>()

    // 初始化需要返回的异常信息字段
    let status: number = exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR
    let code: number = exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception.message ?? exception

    // ApiException 类型的异常数据
    if (exception.name === 'ApiException') {
      status = HttpStatus.OK
      code = exception.code
    }

    // HttpException 类型的异常数据
    if (exception.name === 'HttpException') {
      code = exception.status
    }

    // 处理全局 DTO 管道校验的异常信息数据
    if (exception.name === 'BadRequestException') {
      code = exception.status
      message = Array.isArray(exception.response.message) ? exception.response.message[0] : exception.response.message
    }

    // ThrottlerException 请求节流类型的异常数据
    if (exception.name === 'ThrottlerException') {
      code = HttpStatus.TOO_MANY_REQUESTS
      message = '您的操作过于频繁，请稍后再试'
    }

    // NotFoundException 请求节流类型的异常数据
    if (exception.name === 'NotFoundException') {
      if (exception.message.includes('favicon.ico')) return // 不处理 favicon.ico 找不到的异常
      message = '请求的资源未找到，请确认 URL 是否正确'
    }

    // 数据库连接异常
    if (exception.code === 'ECONNRESET' && exception.driverError) {
      message = '数据库连接异常，请联系管理员'
    }

    if (message.includes('foreign key constraint fails')) {
      message = '数据库存在外键约束，导致操作失败'
    }

    // 错误日志终端打印
    Logger.error(`${request.method.toUpperCase()} ${request.path} ${message}`)
    // console.log(JSON.stringify(exception))

    // console.log(`\n------------------------------ Query Params ------------------------------`)
    // Logger.error(`'查询参数': ${JSON.stringify(request.query || {})}`)

    // console.log(`\n------------------------------- Body Params ------------------------------`)
    // Logger.error(`'序列参数': ${JSON.stringify(request.body || {})}`)

    response.status(status)
    response.setHeader('Content-Type', 'application/json')
    response.json({ code, success: false, message, data: null, timestamp: Date.now() })
  }
}
