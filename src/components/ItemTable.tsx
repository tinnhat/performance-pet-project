import ImageCus from './Image'
import { type RowComponentProps } from 'react-window'
import type { User } from './types'

function ItemTable({ index, data, style }: RowComponentProps<{ data: User[] }>) {
  const item = data[index]

  return (
    <div className='table-row' style={style}>
      <div>#{item.id.toString().padStart(3, '0')}</div>
      <div>{item.name}</div>
      <div>{item.birthday}</div>
      <div>{item.sdt}</div>
      <div>{item.email}</div>
      <div>{item.role}</div>
      <div>
        <ImageCus avatar_url={item.avatar_url} name={item.name} />
      </div>
      <div>
        <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
    </div>
  )
}

export default ItemTable