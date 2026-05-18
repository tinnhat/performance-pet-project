import React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import HeaderTable from './HeaderTable'
import TanStackItemTable from './TanStackItemTable'
import type { User } from './types'

function TanStackTable({ data }: { data: User[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 8,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return (
    <div className='table-container'>
      <HeaderTable />

      <div
        ref={parentRef}
        className='table-scroll'
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
            width: '100%',
          }}
        >
          {virtualRows.map((virtualRow) => {
            const item = data[virtualRow.index]

            return (
              <TanStackItemTable
                key={virtualRow.key}
                item={item}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TanStackTable