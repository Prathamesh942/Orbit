import { useState } from 'react'
import './App.css'
import OrbitLab from './pages/OrbitLab'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <OrbitLab />
    </>
  )
}

export default App
