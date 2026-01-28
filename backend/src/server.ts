import {connection} from "./db"
import type { Error as E }  from "mongoose"
import app from ".";
import dotenv from "dotenv";
dotenv.config();


connection.then(()=>{
  console.log("Connected to database 🏬")
  app.listen(process.env.port, ()=>{
    console.log(`🌐 connected successfully to port ${process.env.port}`)
  })
}).catch((e:E)=>{
  throw new Error(e.message)
})
