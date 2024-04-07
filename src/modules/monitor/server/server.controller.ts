import { Controller, Get } from '@nestjs/common'
import { ServerService } from './server.service'

@Controller('monitor')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  /* 获取监控数据 */
  @Get('server')
  async getServer() {
    const cpu = this.serverService.getCpu()
    const mem = this.serverService.getMem()
    const sys = this.serverService.getSys()
    const sysFiles = this.serverService.getSysFiles()
    const promiseArr = await Promise.all([cpu, mem, sys, sysFiles])
    return { cpu: promiseArr[0], mem: promiseArr[1], sys: promiseArr[2], sysFiles: promiseArr[3] }
  }
}
