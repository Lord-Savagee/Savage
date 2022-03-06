import WAClient from "../lib/WAClient";

export default class ModsChecker {
  constructor(public client: WAClient) {}

  check = async (): Promise<void> => {
    const mods = await (await this.client.getFeatures("mods")).jids;
    if (mods === this.client.config.mods)
      return void this.client.log(`Check! ${mods.length} mods for this bot`);
    this.client.config.mods = mods;
    return void this.client.log(`Check! Added required mods for the bot.`);
  };
}
