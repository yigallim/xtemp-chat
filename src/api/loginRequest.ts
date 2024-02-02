import { authInstance } from "./instance";

export default async function loginRequest(username: string, password: string) {
  const data = {
    username,
    password,
  };
  const response = await authInstance.post("/login", data);
  return response.data;
}
