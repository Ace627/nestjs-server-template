import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ToolService } from './tool.service'

@ApiTags('工具服务')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('captcha')
  @ApiOperation({ summary: '获取验证码' })
  @ApiQuery({ name: 'type', type: 'string', description: '验证码类型', enum: ['string', 'math'], required: false, default: 'string' })
  getCaptcha(@Query('type') type: CaptchaType) {
    return this.toolService.getCaptcha(type)
  }

  @Get('randomUUID')
  @ApiOperation({ summary: '随机UUID' })
  randomUUID() {
    return this.toolService.randomUUID()
  }

  @Post('excelToJson')
  @ApiOperation({ summary: 'Excel转换JSON' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'file', format: 'binary', description: '要上传的文件' } } } })
  @UseInterceptors(FileInterceptor('file'))
  excelToJson(@UploadedFile() file: Express.Multer.File) {
    return this.toolService.excelToJson(file)
  }
}
