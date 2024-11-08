import { Injectable } from '@nestjs/common'
import { ExcelUtil } from '@/utils/excel.util'
import { CaptchaUtil } from '@/utils/captcha.util'

@Injectable()
export class ToolService {
  constructor() {}

  randomUUID() {
    return crypto.randomUUID()
  }

  async getCaptcha(type: CaptchaType) {
    const { text, captcha, uuid } = type === 'math' ? await CaptchaUtil.createMathCaptcha() : await CaptchaUtil.createCaptcha()
    return { captcha, uuid }
  }

  async excelToJson(file: Express.Multer.File) {
    const { size } = file
    const records = await ExcelUtil.importExcel(file)
    return { size, total: records.length, records }
  }
}
