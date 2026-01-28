import { api } from "./axios";

export const getProfile =async () => {
  const res = await api.get("/user/me");
  return res.data
}