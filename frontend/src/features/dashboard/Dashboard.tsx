import { SidebarProvider,SidebarTrigger } from '@/appcomponents/ui/sidebar'
import {AppSidebar} from './Siderbar'
import { useEffect,useRef} from 'react'
import Flow from './Flow'
import {  useSelector } from 'react-redux';
import { RootState } from '@/app/store';

import Draw from './Draw';
import {  FlowData, CanvasData } from './dashboardSlice';
const Dashboard =  () => {
  const sidebarTriggerRef = useRef<HTMLButtonElement>(null)
  const selectedFile = useSelector((state:RootState)=> state.dashboard.selectedFile)
  const currentMode = selectedFile?.mode || 'flow';


  useEffect(()=>{
    const handleKeyDown = (e:KeyboardEvent)=>{
      if(e.ctrlKey && e.shiftKey && e.key.toLocaleLowerCase() === "v"){
        e.preventDefault();
        sidebarTriggerRef.current?.click()
      }
    }
    document.addEventListener('keydown',handleKeyDown)
    return()=>{
      document.removeEventListener('keydown',handleKeyDown)
    }
  },[])

  return (
    <div className='flex w-full h-screen'>
    <SidebarProvider>
      <AppSidebar/>
        <main className='w-full relative'>
          <SidebarTrigger className='absolute z-10' ref={sidebarTriggerRef}/> 
          {selectedFile ? (
            <>
            {currentMode === 'canvas' && selectedFile.data && ( <Draw canvasData={selectedFile.data as CanvasData}/>)}
            {currentMode ==="flow" && selectedFile.data && ( <Flow node={(selectedFile.data as FlowData).nodes} edge={(selectedFile.data as FlowData).edges}/>)}
            {currentMode === 'database' && (
              <p>Database design comming soon.</p>
            )}
            </> 
          ):(
            <p className='w-full h-screen p-medium flex items-center justify-center'>Select a file to get started</p>
          )}
        </main>
    </SidebarProvider>
    </div>
  )
}

export default Dashboard