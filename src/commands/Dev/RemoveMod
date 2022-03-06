import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "removemod",
      description: "Will remove a person as a mod",
      category: "dev",
      usage: `${client.config.prefix}removemod [@tag]`,
      modsOnly: true,
      baseXp: 0,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const immortals = this.client.config.mods
      ? [M.sender.jid, this.client.user.jid, ...this.client.config.mods]
      : [M.sender.jid, this.client.user.jid];

    if (M.quoted?.sender) M.mentioned.push(M.quoted.sender);
    if (!M.mentioned.length || !M.mentioned[0])
      return void M.reply("Mention the user whom you want to remove as a mod");
    let text = "";
    // declare tagged as (string | undefined) []
    // const tagged : (string | undefined)[] = []
    for (const user of M.mentioned) {
      if (!immortals.includes(user)) {
        // tagged.push(user)
        text += `🟨 @${user.split("@")[0]} is already not a bot admin`;
        return void M.reply(
          `${text}`,
          undefined,
          undefined,
          // undefined
          [...M.mentioned, M.sender.jid]
        );
      }
      await this.client.removeMod(user);
      setTimeout(async () => {
        const newMods = await (await this.client.getFeatures("mods")).jids;
        this.client.config.mods = newMods;
        text += `🟥 @${user.split("@")[0]} is no longer a bot admin now.`;
        return void M.reply(
          `${text}`,
          undefined,
          undefined,
          // undefined
          [...M.mentioned, M.sender.jid]
        );
      }, 2000);
    }
  };
}
