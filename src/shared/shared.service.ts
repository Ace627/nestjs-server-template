import crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import iconvLite from 'iconv-lite'
import type { Request } from 'express'

@Injectable()
export class SharedService {
  /** 获取请求IP */
  getRequestIP(request: Request): string {
    // 判断是否有反向代理 IP || 判断后端的 socket 的 IP
    return ((request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress || '').replace('::ffff:', '')
  }

  /** 判断IP是不是内网 */
  isLan(ip: string) {
    ip.toLowerCase()
    if (ip == 'localhost') return true
    let a_ip = 0
    if (ip == '') return false
    const ipList = ip.split('.')
    if (ipList.length != 4) return false
    a_ip += parseInt(ipList[0]) << 24
    a_ip += parseInt(ipList[1]) << 16
    a_ip += parseInt(ipList[2]) << 8
    a_ip += parseInt(ipList[3]) << 0
    a_ip = (a_ip >> 16) & 0xffff
    return a_ip >> 8 == 0x7f || a_ip >> 8 == 0xa || a_ip == 0xc0a8 || (a_ip >= 0xac10 && a_ip <= 0xac1f)
  }

  /** 通过 IP 获取地理位置 */
  async getLocation(ip: string) {
    if (this.isLan(ip)) return '内网IP'
    try {
      const response = await axios.get(`http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, { responseType: 'arraybuffer' })
      const data = JSON.parse(iconvLite.decode(response.data, 'gbk'))
      return data.pro + ' ' + data.city
    } catch (error) {
      return '未知'
    }
  }

  /** 随机 UUID */
  randomUUID(): string {
    return crypto.randomUUID()
  }
}
