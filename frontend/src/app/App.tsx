import './App.css'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/hooks'
import { checkAuth } from '@/features/auth/authThunks'
import Footer from '@/components/Footer'


function App() {
  const dispatch = useAppDispatch();
  
  useEffect(()=>{
    dispatch(checkAuth())
  },[])


  return (
    <div className='text-red-200'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
