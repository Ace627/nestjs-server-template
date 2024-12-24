import { Controller, Get } from '@nestjs/common'
import { ServerService } from './server.service'

@Controller('monitor/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get('cpu')
  getCpuInfo() {
    return this.serverService.getCpuInfo()
  }

  @Get('arch')
  getArchInfo() {
    return this.serverService.getArchInfo()
  }

  @Get('disk')
  getDiskInfo() {
    return this.serverService.getDiskInfo()
  }

  @Get('memory')
  getMemoryInfo() {
    return this.serverService.getMemoryInfo()
  }
}
