import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient, { toggleableGroupActions } from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      adminOnly: true,
      command: "deactivate",
      aliases: ["deact"],
      description: "deactivate certain features on group-chats",
      category: "moderation",
      usage: `${client.config.prefix}deactivate [feature]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const type = joined.trim().toLowerCase() as toggleableGroupActions;
    if (!Object.values(toggleableGroupActions).includes(type))
      return void M.reply(
        `🟥 Invalid Option: *${this.client.util.capitalize(type)}*`
      );
    const data = await this.client.getGroupData(M.from);
    if (!data[type])
      return void M.reply(
        `🟨 *${this.client.util.capitalize(
          type
        )}* is already *inactived*, Baka!`
      );
    if (type === "wild") {
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { wild: false } }
      );
      await this.client.DB.feature.updateOne(
        { feature: "pokemon" },
        { $pull: { jids: M.from } }
      );
      return void M.reply(
        `🟩 *${this.client.util.capitalize(type)}* is now inactive`
      );
    }
    if (type === "chara") {
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { chara: true } }
      );
      await this.client.DB.feature.updateOne(
        { feature: "chara" },
        { $pull: { jids: M.from } }
      );
      return void M.reply(`🟩 *Chara* is now inactive`);
    }
    if (type === "news") {
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { news: false } }
      );
      await this.client.DB.feature.updateOne(
        { feature: "news" },
        { $pull: { jids: M.from } }
      );
      return void M.reply(
        `🟩 *${this.client.util.capitalize(type)}* is now inactive`
      );
    }
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { [type]: false } }
    );
    return void M.reply(
      `🟩 *${this.client.util.capitalize(type)}* is now inactive`
    );
  };
}
