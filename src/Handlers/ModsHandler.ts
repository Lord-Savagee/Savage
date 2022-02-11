import { WAParticipantAction } from "@adiwajshing/baileys";
//import { evaluate } from "mathjs";
import WAClient from "../lib/WAClient";
export default class ModsHandler {
  constructor(public client: WAClient) {}

  handleMods = async (event: IEvent): Promise<void> => {
    const user = event.participants[0];
    const bye = event.action === "remove";
    const promote = event.action === "promote";
    const demote = event.action === "demote";
    if (event.jid !== "120363022692889219@g.us") return void null;
    const data = await (await this.client.getFeatures("mods")).jids;
    if (bye || demote) {
      if (!data.includes(user)) return void null;
      await this.client.removeMod(user);
      setTimeout(async () => {
        const newMods = await (await this.client.getFeatures("mods")).jids;
        this.client.config.mods = newMods;
        return void this.client.log(
          `${user.split("@")} is not a bot admin now.`
        );
      }, 2000);
    } else if (promote) {
      if (data.includes(user)) return void null;
      await this.client.addMod(user);
      setTimeout(async () => {
        const newMods = await (await this.client.getFeatures("mods")).jids;
        this.client.config.mods = newMods;
        return void this.client.log(`${user.split("@")} is a bot admin now.`);
      }, 2000);
    }
  };
}

interface IEvent {
  jid: string;
  participants: string[];
  actor?: string | undefined;
  action: WAParticipantAction;
}
