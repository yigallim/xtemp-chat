import { authInstance } from "./instance";

export default async function registerRequest(userInfo: object) {
  const response = await authInstance.post("/register", userInfo);
  return response.data;
}
