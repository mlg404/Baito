import TwitchService from "./services/TwitchService";

const app = async () => {
  const twitchService = new TwitchService();
  const streamersIds = await twitchService.getBroadcasterIds([
    "gaules",
    "deercheerup",
  ]);
  const data = await twitchService.getClips(streamersIds);
  console.log(data);
};

app();
