import TwitchService from "./services/TwitchService";

const app = async () => {
  const twitchService = new TwitchService();
  const streamersIds = await twitchService.getBroadcasterIds([
    "gaules",
    "liminhag0d",
    "mch_agg",
  ]);
  const data = await twitchService.getClipsMultiStream(streamersIds);
  console.log(data);
};

app();
