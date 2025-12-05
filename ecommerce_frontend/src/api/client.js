import axios from 'axios';
import { getEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * Returns a preconfigured axios instance for API calls.
 */
export function apiClient() {
  /** Axios client with baseURL from env and credentials enabled */
  const { apiBase } = getEnv();
  const instance = axios.create({
    baseURL: apiBase,
    withCredentials: true, // send cookies if backend sets any
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return instance;
}
