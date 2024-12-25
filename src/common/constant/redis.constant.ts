export class RedisKey {
  /** 动态生成 Redis Key */
  private static generateKey(baseKey: string, ...params: string[]): string {
    return `${baseKey}:${params.join(':')}`
  }

  /** 生成验证码的 Redis Key */
  static getCaptchaKey(uuid: string) {
    return this.generateKey('captcha:img', uuid)
  }

  /** 生成管理端用户 Token 的 Redis Key */
  static getAdminUserTokenKey(userId: string): string {
    return this.generateKey('admin:user:token', userId)
  }

  /** 生成客户端用户 Token 的 Redis Key */
  static getClientUserTokenKey(userId: string): string {
    return this.generateKey('client:user:token', userId)
  }
}
