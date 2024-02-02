import { apiInstance } from "./instance";

export async function getProfileRequest(id: string) {
  const response = await apiInstance.get(`/users/${id}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data;
}

export async function updateProfileRequest(id: string, data: object) {
  const response = await apiInstance.put(`/users/${id}`, data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data;
}

export async function getAllProfileRequest() {
  const response = await apiInstance.get("/users", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data;
}

export async function uploadProfilePicture(id: string, formData: FormData): Promise<string> {
  const pfpUrl = (await apiInstance.post(`/users/upload-pfp/${id}`, formData, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
  })).data as string;
  return pfpUrl;
}
