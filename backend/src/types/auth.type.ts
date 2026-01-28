import type { JwtPayload } from "jsonwebtoken"

type IdTokenObj = JwtPayload & {
  iss: string,
  azp: string,
  aud: string,
  sub: string,
  at_hash: string,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  iat: number,
  exp: number
}


type UserSessionPayload = {
  name: string,
  sub: string,
  picture: string
}
export type {IdTokenObj,UserSessionPayload}