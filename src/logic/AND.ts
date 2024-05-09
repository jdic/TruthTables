import type { IToPDFOptions } from '../types/DPDF'
import type { TableType } from '../types/DTable'
import toPDF from '../utils/toPDF'

const AND = (inputs: number): { table: TableType[], toPDF: (options?: IToPDFOptions) => void } =>
{
  const combinations = Math.pow(2, inputs)
  const table: TableType[]  = []

  for (let i = 0; i < combinations; i++)
  {
    const binary = (i).toString(2).padStart(inputs, '0')
    const row: boolean[] = []
    
    for (const key of binary)
      row.push(key === '1')

    const output = row.reduce((acc, curr) => acc && curr, true)

    table.push([...row, output])
  }

  return { table, toPDF: (options?: IToPDFOptions) => toPDF(table, inputs, options)}
}

export default AND