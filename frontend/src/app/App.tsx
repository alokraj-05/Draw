import './App.css'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/hooks'
import { checkAuth } from '@/features/auth/authThunks'


function App() {
  const dispatch = useAppDispatch();
  
  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])


  return (
    <div className='text-red-200'>
      <Outlet/>
    </div>
  )
}

export default App
