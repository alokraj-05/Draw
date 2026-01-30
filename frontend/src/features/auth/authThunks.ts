import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/axios";


export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_,{rejectWithValue}) =>{
    try{
      const res = await api.get("/auth/me")
      console.log("Auth ok", res.data)
      return res.data
    } catch (err){
      console.log("AUth fail",err)
      return rejectWithValue(null)
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async () =>{
    await api.get("/auth/logout");
    return true
  }
)