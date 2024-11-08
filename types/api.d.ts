/** 分页列表的查询参数泛型 */
type TableQueryParams<T = any> = Partial<T & { pageNo: number; pageSize: number; take: number; skip: number }>
