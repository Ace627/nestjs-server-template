import { HttpException, HttpStatus } from '@nestjs/common'

export class ApiException extends HttpException {
  private code: number

  constructor(message: string, code?: number) {
    // 权限问题一律使用 401 错误码
    if (code && code === HttpStatus.UNAUTHORIZED) {
      super(message, HttpStatus.OK)
      this.code = HttpStatus.UNAUTHORIZED
    } else {
      // 其它异常一律使用 500 错误码
      super(message, code ?? HttpStatus.OK)
      this.code = code ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getCode(): number {
    return this.code
  }
}
