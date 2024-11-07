import { Injectable } from '@nestjs/common'
import { ExcelUtil } from '@/utils/excel.util'
import { CaptchaUtil } from '@/utils/captcha.util'

@Injectable()
export class ToolService {
  randomUUID() {
    return crypto.randomUUID()
  }

  getCaptcha(type: CaptchaType) {
    return type === 'math' ? CaptchaUtil.createMathCaptcha() : CaptchaUtil.createCaptcha()
  }

  async excelToJson(file: Express.Multer.File) {
    const { size } = file
    const records = await ExcelUtil.importExcel(file)
    return { size, total: records.length, records }
  }
}
