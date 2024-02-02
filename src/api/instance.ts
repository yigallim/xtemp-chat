import axios from "axios";

export const INTERNAL = "http://127.0.0.1:3000";
export const HOME = "http://192.168.1.107:3000";
export const ngrok = "https://326b-2001-d08-de-f057-f95f-1d3b-2f4d-d9cb.ngrok-free.app";
export const BASE_URL = ngrok;

const authInstance = axios.create({
  baseURL: `${BASE_URL}/auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

const apiInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

export { authInstance, apiInstance };
