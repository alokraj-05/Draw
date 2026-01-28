import { api } from "./axios";

const getFiles = async () => {
   const res = await api.get('/user/files')
   return res.data.items
}

const saveFile = async (filename:string,type:string) => {
   try {
      const res= await api.post(`/user/files/${filename}.draw.json`,{
         type: type
      })
      return res.data
      
   } catch (error) {
      console.error(error)
   }
}

const getSpecificFile = async (fileId: string) =>{
   try {
      const res = await api.get(`/user/files/${fileId}`)
      return res.data
   } catch (error) {
      console.error(error)
      return {}
   }
}

const updateFile = async (fileId: string,file:any)=>{
   try {
      const res = await api.patch(`/user/files/${fileId}`,file)
      return res.data
   } catch (error) {
      console.log(error)
   }
}
export {getFiles,saveFile,getSpecificFile,updateFile}