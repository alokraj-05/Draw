import { Document,Schema,model } from "mongoose";

export interface User {
  name: string,
  email:string,
  sub: string,
  image:string
}

export interface GoogleOAuth extends Document {
  refresh_token: string,
  expiry_date: number,
  token_type:string,
}

const UserDetailsSchema = new Schema({
  name: String,
  email: String,
  sub: String,
  image: String
})

const UserCredScheme = new Schema({
  refresh_token: String,
  expiry_date: Number,
  token_type:String,
  user: UserDetailsSchema
})



export default model("UserCred",UserCredScheme);