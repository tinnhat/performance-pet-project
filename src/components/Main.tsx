import HeaderTable from './HeaderTable'
import ItemTable from './ItemTable'
import { List } from 'react-window'
import type { User } from './types'

function Main({ data }: { data: User[] }) {
  return (
    <div className='table-container'>
      <HeaderTable />

      <List
        rowComponent={ItemTable}
        rowCount={data.length}
        rowHeight={64}
        rowProps={{ data }}
        style={{ height: 600 }}
      />
    </div>
  )
}

export default Main