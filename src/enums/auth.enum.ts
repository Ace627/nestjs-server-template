export enum AuthEnum {
  /** Token 前缀字符 */
  TOKEN_PREFIX = 'Bearer',
  /** 凭证请求头的 Key */
  Authorization = 'Authorization',
  /** 分配给请求对象的有效载荷 以便我们可以在路由处理程序中访问它 */
  REQUEST_PAYLOAD = 'user',
}
