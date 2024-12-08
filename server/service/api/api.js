import axios from "axios";
import ENDPOINTS from "./endpoints.js";

const apiClient = axios.create({
  baseURL: process.env.TUNEMATE_SERVICES_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

const RedisServerClient = axios.create({
  baseURL: process.env.REDIS_SERVER_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

class MusicService {
  getSingleSong = async (song_id) => {
    try {
      const response = await apiClient.get(ENDPOINTS.song(song_id));
      return response.data.data;
    } catch (err) {
      return err;
    }
  };

  addConnectioninRedis = async (data) => {
    try {
      const response = await RedisServerClient.post(
        ENDPOINTS.addConnection,
        data
      );
      return response.data;
    } catch (err) {
      return err;
    }
  };
}

const MusicServiceInstance = new MusicService();

export default MusicServiceInstance;
