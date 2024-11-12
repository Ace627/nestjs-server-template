/** 字符串首字母大写 */
export function firstToUpper(pathStr: string) {
  const str = pathStr.replaceAll('/', '').trim()
  // return str ? str.toLowerCase().replace(str[0], str[0].toUpperCase()) : ''
  return str ? str.replace(str[0], str[0].toUpperCase()) : ''
}
