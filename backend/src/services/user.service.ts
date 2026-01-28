
import { GOOGLE_BASE_URL } from "../utils/utils";
import axios from "axios";
import { getValidAccessToken } from "./googleClient";
import { google } from "googleapis";
import { Readable } from "stream";


export const getFiles = async (sub:string) =>{
  const access_token = await getValidAccessToken(sub)
    try {
      
      const res = await axios.get(`${GOOGLE_BASE_URL}drive/v2/files`,{
        headers:{
          Authorization: `Bearer ${access_token}`
        }
      })
      return res.data
    } catch (error: any) {
      console.error(error.response?.data)
    }
}

export const createFile = async (auth: any,filename:string,type:string) =>{
  const drive = google.drive({version:"v3",auth});

  const fileMetadata = {
    name: `${filename}`,
    mimeType: 'application/json',
  }
  let file;
  switch(type){
    case "canvas":{
      const CANVAS_DRAW_FILE ={
        version:1,
        type: type,
        element: []
      }
      file = CANVAS_DRAW_FILE
      break;
    }
    case "flow":{
      const FLOW_DRAW_FILE = {
        version: 1,
        type: type,
        nodes:[],
        edges:[]
      }
      file = FLOW_DRAW_FILE
      break;
    }
  }
  console.log(file)
  const content = {
    mimeType: 'application/json',
    body: Readable.from(JSON.stringify(file,null,2))
  }
  try {
    const res = await drive.files.create({requestBody:fileMetadata,media:content})
    return res.data
    
  } catch (error) {
    console.error(error)
    return null
  }

}

export const getFile = async (sub:string,fileId: string) =>{
  const access_token = await getValidAccessToken(sub);
  const res = await axios.get(`${GOOGLE_BASE_URL}drive/v2/files/${fileId}`,{
    params:{
      alt: "media"
    },
    headers:{
      Authorization: `Bearer ${access_token}`,
      "Content-Type":"application/json"
    }
  })
  return res.data
}

export const updateFile = async (sub: string,fileId:string,file:any)=>{
  const access_token = await getValidAccessToken(sub);
  // Send the full file content as JSON so different file shapes (canvas/flow/etc.) are supported
  const res = await axios.patch(
    `${GOOGLE_BASE_URL}upload/drive/v3/files/${fileId}?uploadType=media`,
    JSON.stringify(file),
    {
    headers:{
      Authorization: `Bearer ${access_token}`,
      'Content-Type':"application/json"
    }
  })
  return res.data
}

export const getUser = async (sub: string) =>{
  const access_token = await getValidAccessToken(sub);

  const res = await axios.get(`${GOOGLE_BASE_URL}drive/v3/about/?fields=kind,user`,{
    headers:{
      Authorization: `Bearer ${access_token}`
    }
  })

  return res.data
}