import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "trade-delete",
      aliases: ["t-delete"],
      description: "Deletes the ongoing pokemon trade of the group.",
      category: "pokemon",
      usage: `${client.config.prefix}trade-delete`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const data = await await this.client.getGroupData(M.from);
    if (!data.trade) return void M.reply(`🟥 *There aren't any trade ongoing*`);
    if (data.startedBy !== M.sender.jid)
      return void M.reply(`🟥 *You can't delete this trade*`);
    await this.client.DB.group.updateMany(
      { jid: M.from },
      { $unset: { tOffer: "", tWant: "", startedBy: "" } }
    );
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { trade: false } }
    );
    return void M.reply(`Pokemon trade deleted.`);
  };
}
