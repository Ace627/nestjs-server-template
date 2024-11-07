import os from 'os'
import axios from 'axios'
import iconvLite from 'iconv-lite'

export class IpUtil {
  /** 判断给定的 IP 地址是否为局域网 IP 地址 */
  static isLan(ip: string): boolean {
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

  /** 获取本机局域网 ipv4 地址 */
  static getLocalLanIPv4(): string {
    const interfaces = os.networkInterfaces()
    for (const iface in interfaces) {
      for (const alias of interfaces[iface]) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address
        }
      }
    }
    return '0.0.0.0' // 如果没有找到 IPv4 地址，则返回 '0.0.0.0'
  }

  /** 根据 IP 地址获取地理位置信息 */
  static async getLocation(ip: string): Promise<string> {
    if (this.isLan(ip)) return '内网IP'
    try {
      const response = await axios.get(`http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, { responseType: 'arraybuffer' })
      const data = JSON.parse(iconvLite.decode(response.data, 'gbk'))
      return data.pro + ' ' + data.city
    } catch (error) {
      return '未知'
    }
  }
}
