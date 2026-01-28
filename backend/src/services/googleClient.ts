import { oauth2Client } from "./auth.service";
import { getRefreshToken } from "./getTokenStore";

let cachedAccessToken : string | null = null
let cachedExpiryDuration : number | null = null

export const getValidAccessToken = async (sub: string) => {
  if(cachedAccessToken && cachedExpiryDuration &&  Date.now() < cachedExpiryDuration - 60_000){
    return cachedAccessToken
  }
  const refreshToken = await getRefreshToken(sub)
  if(!refreshToken) throw new Error("No refresh token found");
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })

  const { token, res }= await oauth2Client.getAccessToken()
  if(!token || !res) throw new Error("Failed to refresh token")
  
  cachedAccessToken = token
  cachedExpiryDuration = res.data.expiry_date
  return cachedAccessToken
}

