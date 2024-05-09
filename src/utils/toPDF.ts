import type { IToPDFOptions } from '../types/DPDF'
import type { TableType } from '../types/DTable'
import PDF from 'pdfkit'
import fs from 'fs'

const toPDF = (table: TableType[], inputs: number, options?: IToPDFOptions) =>
{
  const pdf = new PDF()

  pdf.pipe(fs.createWriteStream(options?.file || 'output.pdf'))
  pdf.fontSize(options?.fontSize || 8)

  const rowsPerPage = options?.rowsPerPage || 52
  const rows = table.length
  const pages = Math.ceil(rows / rowsPerPage)
  const cols = table[0].length
  const cellSize = options?.cellSize || 13

  let startRow = 0

  for (let page = 0; page < pages; page++)
  {
    if (page !== 0)
      pdf.addPage()

    const endRow = Math.min(startRow + rowsPerPage, rows)
    const currentRows = endRow - startRow

    Array
      .from({ length: inputs }, (_, i) => String.fromCharCode(65 + i))
      .forEach((header, i) =>
      {
        pdf.rect(cellSize * i, 0, cellSize, cellSize).stroke()
        pdf.text(header, i * cellSize + 3, 3)
      })

    pdf.rect(cellSize * (cols - 1), 0, cellSize, cellSize).stroke()
    pdf.text('Y', cols * cellSize - cellSize / 2 - 3, 3)

    for (let i = 0; i < currentRows; i++)
    {
      for (let j = 0; j < cols; j++)
      {
        const index = startRow + i
        const y = i * cellSize + cellSize

        pdf.rect(j * cellSize, y, cellSize, cellSize).stroke()
        pdf.text(table[index][j] ? '1' : '0', j * cellSize + cellSize / 2 - 3, y - cellSize / 2 + 10)
      }
    }

    startRow = endRow
  }

  pdf.end()
}

export default toPDF