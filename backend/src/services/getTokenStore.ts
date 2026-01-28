import User from "../models/User";

export const getRefreshToken = async (sub: string) => {
  const user = await User.findOne({"user.sub":sub}).select("refresh_token").exec()
  if(!user) throw new Error("No User Found");

  return user.refresh_token
}