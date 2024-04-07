import { Injectable } from '@nestjs/common'
import systeminformation from 'systeminformation'

@Injectable()
export class ServerService {
  /* 获取 cpu 信息 */
  async getCpu() {
    const cpu = await systeminformation.cpu()
    const currentLoad = await systeminformation.currentLoad()
    const count = cpu.cores // 核心数
    const used = currentLoad.currentLoadUser.toFixed(2) + '%' // 用户使用率
    const sys = currentLoad.currentLoadSystem.toFixed(2) + '%' // 系统使用率
    const free = (100 - currentLoad.currentLoadUser - currentLoad.currentLoadSystem).toFixed(2) + '%' // 当前空闲率
    return { count, used, free, sys }
  }

  /* 获取内存信息 */
  async getMem() {
    const mem = await systeminformation.mem()
    const total = (mem.total / (1024 * 1024 * 1024)).toFixed(2) + 'GB' // 总内存
    const used = (mem.used / (1024 * 1024 * 1024)).toFixed(2) + 'GB' // 已用内存
    const free = (mem.free / (1024 * 1024 * 1024)).toFixed(2) + 'GB' // 剩余内存
    const usage = (((mem.used / (1024 * 1024 * 1024)) * 100) / (mem.total / (1024 * 1024 * 1024))).toFixed(2) + '%' // 使用率
    return { total, used, free, usage }
  }

  /* 服务器信息 */
  async getSys() {
    const osInfo = await systeminformation.osInfo()
    const networkInterfaces = systeminformation.networkInterfaces
    const net = await networkInterfaces()
    const hostname = osInfo.hostname // 服务器名称
    const platform = osInfo.platform // 操作系统
    const ip = net[0].ip4 // 服务器IP
    const arch = osInfo.arch // 系统架构
    return { hostname, platform, ip, arch }
  }

  /* 获取磁盘状态 */
  async getSysFiles() {
    const count = 1024 * 1024 * 1024
    const fsSize = systeminformation.fsSize
    const disk = await fsSize()
    const sysFilesArr = disk.map((item) => {
      const dirName = item.fs // 盘符路径
      const sysTypeName = item.type // 文件系统
      const typeName = item.mount // 盘符类型
      const total = (item.size / count).toFixed(2) + 'GB' // 总大小
      const free = (item.size / count - item.used / count).toFixed(2) + 'GB' // 可用大小
      const used = (item.used / count).toFixed(2) + 'GB' // 已用大小
      const usage = item.use.toFixed(2) + '%' // 已用百分比
      return { dirName, sysTypeName, typeName, total, free, used, usage }
    })
    return sysFilesArr
  }
}
