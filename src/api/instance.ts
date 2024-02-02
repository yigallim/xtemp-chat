import axios from "axios";

export const INTERNAL = "127.0.0.1";
export const HOME = "192.168.1.107";
export const ngrok = "6885-2001-d08-de-f057-f95f-1d3b-2f4d-d9cb.ngrok-free.app";
export const BASE_URL = INTERNAL;

const authInstance = axios.create({
  baseURL: `http://${BASE_URL}:3000/auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiInstance = axios.create({
  baseURL: `http://${BASE_URL}:3000/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { authInstance, apiInstance };
