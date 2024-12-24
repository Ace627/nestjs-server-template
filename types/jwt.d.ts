interface JwtPayload {
  username: string
  userId: string
  iat: number // 签发时间
  exp: number // 过期时间
}
