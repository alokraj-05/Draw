import axios from "axios";


// [TODO] Vite env var access issue (fuck it)
// const BACKEND_URL = process.env.BACKEND_URL
async function googleLogin(){
  const res = await axios.get(`http://localhost:3334/api/auth/login-google`)
  return res
}

export default googleLogin