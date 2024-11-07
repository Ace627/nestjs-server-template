import ExcelJS from 'exceljs'

export class ExcelUtil {
  /**
   * 导入 Excel 文件并将其转换为记录数组
   * @param {Express.Multer.File} file - 上传的 Excel 文件
   * @returns {Promise<Record<string, any>[]>} - 返回一个包含每行记录的数组，记录以对象形式表示
   */
  static async importExcel(file: Express.Multer.File): Promise<Record<string, any>[]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(file.buffer)
    const worksheet = workbook.worksheets[0]
    const headers: string[] = []
    const records = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell) => headers.push(cell.value.toString())) // 假设第一行是标题行，我们将其存起来用于映射
      } else {
        const record = {}
        row.eachCell((cell, colNumber) => (record[headers[colNumber - 1]] = cell.value))
        records.push(record)
      }
    })
    return records
  }

  /**
   * 导出 Excel 文件，生成包含指定标题和记录的工作表
   * @param {Partial<ExcelJS.Column>[]} headers - 列标题和配置的数组，包含列的宽度、标题等信息
   * @param {unknown[]} [records=[]] - 要添加到工作表的记录数组，默认值为空数组
   * @param {string} [sheetName] - 工作表名称，默认为 'Sheet1'
   * @returns {Promise<Buffer>} - 返回生成的 Excel 文件的 Buffer
   */
  static async exportExcel(headers: Partial<ExcelJS.Column>[], records: unknown[] = [], sheetName?: string) {
    const workbook = new ExcelJS.Workbook() // 创建工作簿
    const worksheet = workbook.addWorksheet(sheetName ?? 'Sheet1', { properties: { defaultColWidth: 16 } }) // 添加工作表
    if (headers) worksheet.columns = headers // 添加列标题并定义列键和宽度
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }] // 冻结首行
    worksheet.columns.forEach((column) => (column.alignment = { vertical: 'middle', horizontal: 'center' })) // 单元格内容水平垂直居中对齐
    worksheet.getRow(1).font = { bold: true } // 首行文本加粗
    worksheet.addRows(records)
    return workbook.xlsx.writeBuffer()
  }
}
