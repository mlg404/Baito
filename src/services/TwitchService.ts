import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { beforeNow, now } from "../helpers/date";
import {
  ClipInterface,
  StreamerInterface,
  TwitchResponse,
} from "../models/Twitch";

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

  public async getClipsSingleStream(broadcasterId: string) {
    try {
      const {
        data: { data },
      } = await this.twitchApi.get("/clips", {
        params: {
          broadcaster_id: broadcasterId,
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

  public async getClipsMultiStream(broadcastersIds: string[]) {
    try {
      const streamsToGetClips: Promise<
        AxiosResponse<TwitchResponse<ClipInterface[]>>
      >[] = [];

      broadcastersIds.forEach((id) => {
        streamsToGetClips.push(
          this.twitchApi.get("/clips", {
            params: {
              broadcaster_id: id,
              started_at: beforeNow("days", 1),
              ended_at: now(),
              first: 5,
            },
          })
        );
      });

      const responseData = await Promise.all(streamsToGetClips);

      return responseData.map(({ data: { data } }) => data);
    } catch (error) {
      console.log(error);
    }
  }
}

export default TwitchService;
