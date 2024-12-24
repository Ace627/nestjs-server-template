import { Injectable } from '@nestjs/common'
import systeminformation from 'systeminformation'

@Injectable()
export class ServerService {
  /**
   * 获取架构信息
   */
  public async getArchInfo() {
    // 获取操作系统信息
    const { hostname, platform, arch } = await systeminformation.osInfo()
    // 获取网络接口信息
    const networkInterfaces = await systeminformation.networkInterfaces()
    // 从第一个网络接口中获取 IPv4 地址 | 如果没有 IPv4 地址则返回 'N/A'
    const ipv4 = networkInterfaces[0]?.ip4 || 'N/A'
    return { hostname, platform, arch, ipv4 }
  }

  /**
   * 获取 CPU 信息
   */
  public async getCpuInfo() {
    const cpu = await systeminformation.cpu() // 获取 CPU 基本信息
    const currentLoad = await systeminformation.currentLoad() // 获取 CPU 当前负载
    const { manufacturer, brand, cores } = cpu
    const used = currentLoad.currentLoadUser.toFixed(2) + '%' // 用户空间使用的 CPU 百分比，保留两位小数
    const sys = currentLoad.currentLoadSystem.toFixed(2) + '%' // 系统空间使用的 CPU 百分比，保留两位小数
    const free = (100 - currentLoad.currentLoadUser - currentLoad.currentLoadSystem).toFixed(2) + '%' // 剩余空闲的 CPU 百分比，保留两位小数
    return { manufacturer, brand, cores, used, sys, free }
  }

  /**
   * 获取内存信息
   */
  public async getMemoryInfo() {
    const memory = await systeminformation.mem()
    const total = (memory.total / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    const used = (memory.used / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    const free = (memory.free / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    const usage = (((memory.used / (1024 * 1024 * 1024)) * 100) / (memory.total / (1024 * 1024 * 1024))).toFixed(2) + '%'
    return { total, used, free, usage }
  }

  /**
   * 获取磁盘信息
   */
  public async getDiskInfo() {
    // 获取系统所有的磁盘分区信息
    const disk = await systeminformation.fsSize()
    return disk.map((diskInfo) => {
      // 将磁盘的总容量、已用容量和剩余容量从字节转换为 GB
      const total = (diskInfo.size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      const free = (diskInfo.size / (1024 * 1024 * 1024) - diskInfo.used / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      const used = (diskInfo.used / (1024 * 1024 * 1024)).toFixed(2) + 'GB'

      // 获取磁盘的使用百分比，保留两位小数，避免 use 为空的情况
      const usage = diskInfo.use ? diskInfo.use.toFixed(2) + '%' : 'N/A'

      // 获取文件系统类型和挂载点信息
      const type = diskInfo.type || 'N/A'
      const mount = diskInfo.mount || 'N/A'

      // 返回包含所需信息的对象
      return { mount, type, total, free, used, usage }
    })
  }
}
