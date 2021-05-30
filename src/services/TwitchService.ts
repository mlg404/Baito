import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { beforeNow, now } from "../helpers/date";
import { StreamerInterface, TwitchResponse } from "../models/Twitch";

const { parsed: envs } = dotenv.config();

class TwitchService {
  private twitchApi: AxiosInstance;

  constructor() {
    this.twitchApi = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        Authorization: `Bearer ${envs!.TWITCH_CLIENT_TOKEN}`,
        "Client-Id": envs!.TWITCH_CLIENT_ID,
      },
    });
  }

  public async getStreams(streamers: string[]) {
    try {
      const streams = await this.twitchApi.get("/streams", {
        params: {
          user_login: streamers,
        },
      });
      return streams.data;
    } catch ({ response }) {
      console.log("error", response.data);
    }
  }

  public async getBroadcasterIds(streamers: string[]): Promise<string[]> {
    const { data }: TwitchResponse<StreamerInterface> = await this.getStreams(
      streamers
    );
    return data.map((stream: StreamerInterface) => stream.user_id);
  }

  public async getClips(broadcasterIds: string[]) {
    try {
      const { data } = await this.twitchApi.get("/clips", {
        params: {
          broadcaster_id: broadcasterIds[0],
          started_at: beforeNow("days", 1),
          ended_at: now(),
          first: 5,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default TwitchService;
