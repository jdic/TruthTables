import PDF from 'pdfkit'
import fs from 'fs'

type TableType = boolean[]

const inputs = 16
const cellSize = 13

const combinations = Math.pow(2, inputs)
const table: TableType[] = []

const pdf = new PDF()

for (let i = 0; i < combinations; i++) {
  const row: boolean[] = []
  const binary = (i).toString(2).padStart(inputs, '0')

  for (const key of binary)
    row.push(key === '1')

  const tableOutput = row.reduce((acc, val) => acc && val, true)

  table.push([...row, tableOutput])
}

pdf.pipe(fs.createWriteStream('output.pdf'))
pdf.fontSize(8)

const rowsPerPage = 52
const totalRows = table.length
const totalPages = Math.ceil(totalRows / rowsPerPage)
const cols = table[0].length

let startRow = 0

for (let page = 0; page < totalPages; page++)
{
  pdf.addPage()

  const endRow = Math.min(startRow + rowsPerPage, totalRows)
  const currentPageRows = endRow - startRow

  Array
    .from({ length: inputs }, (_, i) => String.fromCharCode(65 + i))
    .forEach((header, i) => {
      pdf.rect(cellSize * i, 0, cellSize, cellSize).stroke()
      pdf.text(header, i * cellSize + 3, 3, { align: 'left' })
    })

  pdf.text('Y', cols * cellSize - cellSize / 2 - 3, 3, { align: 'left' })

  for (let i = 0; i < currentPageRows; i++)
  {
    console.log(i * page)

    for (let j = 0; j < cols; j++)
    {
      const rowIndex = startRow + i
      const yOffset = i * cellSize
      pdf.rect(j * cellSize, yOffset, cellSize, cellSize).stroke()
      pdf.text(table[rowIndex][j] ? '1' : '0', j * cellSize + cellSize / 2 - 3, yOffset + cellSize / 2 + 10, { align: 'left' })
    }
  }

  startRow = endRow
}

pdf.end()