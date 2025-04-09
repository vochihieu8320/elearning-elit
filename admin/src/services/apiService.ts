import axios from "axios";
import config from "../config";
import { STORAGE_KEY } from "../constants";
type TConfig = {
    headers: any,
}
const apiService = axios.create({
    baseURL: config.apiUrl,
})
apiService.interceptors.request.use((config: TConfig)=>{
    let accessToken = '';
    const currentUser = localStorage.getItem(STORAGE_KEY.CURRENT_USER);
    if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          accessToken = parsedUser?.accessToken || "";
        } catch (error) {
          console.error("Lỗi parse JSON từ localStorage:", error);
        }
      }
    config.headers = {
        ...config.headers,
        TokenCybersoft : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjI3LzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1MzU3NDQwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzNzIyMDAwfQ.BTmM2iB4rp2M5zBswdnAhImSAoSPeaxquN5mTgxFzaQ",
        Authorization: `Bearer ${accessToken}`
    }    
    return config;
})
export default apiService