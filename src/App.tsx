import React, { Profiler } from 'react'
import './App.css'
import Main from './components/Main'

function onRender(
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.table({
    id,
    phase,
    actualDuration: `${actualDuration.toFixed(2)}ms`,
    baseDuration: `${baseDuration.toFixed(2)}ms`,
    startTime: `${startTime.toFixed(2)}ms`,
    commitTime: `${commitTime.toFixed(2)}ms`,
  })
}


const generateData = () => {
  const data = []
  for (let i = 0; i < 10000; i++) {
    data.push({
      id: i,
      name: 'Nguyễn Văn A ' + i,
      birthday: `12/04/${1990 + (i % 30)}`,
      sdt: '090123456' + i,
      email: `vana${i}@example.com`,
      role: 'Frontend Developer ' + i,
      avatar_url:
        `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 20) + 1}`,
      status: 'Active',
    })
  }
  return data
}
function App() {
  const [data] = React.useState(generateData())
  return (
   <Profiler id="MainTable" onRender={onRender}>
      <Main data={data} />
    </Profiler>
  )
}

export default App
