import { Controller, Get } from '@nestjs/common'
import { ToolService } from './tool.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('工具服务')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @ApiOperation({ summary: '随机UUID' })
  @Get('randomUUID')
  randomUUID() {
    return this.toolService.randomUUID()
  }
}
