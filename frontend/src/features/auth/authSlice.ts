import { createSlice } from "@reduxjs/toolkit";
import { checkAuth,logout } from "./authThunks";

interface AuthState {
  isAuthenticated: boolean,
  user: any | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: 'idle'
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending,(state)=>{
      state.status = "loading";
    })
    .addCase(checkAuth.fulfilled, (state,action)=>{
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(checkAuth.rejected, (state)=>{
      state.status = "failed";
      state.isAuthenticated = false;
      state.user = null;
    })
    .addCase(logout.fulfilled,(state=>{
      state.isAuthenticated = false,
      state.user = null,
      state.status = "idle"
    }))
  }
})

export default authSlice.reducer;