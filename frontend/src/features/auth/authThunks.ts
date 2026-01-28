import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/axios";


export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_,{rejectWithValue}) =>{
    try{
      const res = await api.get("/auth/me")
      return res.data
    } catch (err){
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