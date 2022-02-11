import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "tchara-delete",
      description: "Deletes the ongoing character trade of the group.",
      category: "characters",
      usage: `${client.config.prefix}tchara-delete`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const data = await await (
      await this.client.getGroupData(M.from)
    ).charaTrade;
    if (!data.ongoing)
      return void M.reply(`🟥 *There aren't any trade ongoing*`);
    if (data.startedBy !== M.sender.jid)
      return void M.reply(`🟥 *You can't delete this trade*`);
    await this.client.DB.group.updateMany(
      { jid: M.from },
      {
        $unset: {
          "charaTrade.startedBy": "",
          "charaTrade.for.id": "",
          "charaTrade.for.name": "",
          "charaTrade.for.source": "",
          "charaTrade.offer.id": "",
          "charaTrade.offer.name": "",
          "charaTrade.offer.image": "",
          "charaTrade.offer.about": "",
          "charaTrade.offer.source": "",
        },
      }
    );
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { "charaTrade.ongoing": false } }
    );
    return void M.reply(`Character trade deleted.`);
  };
}
