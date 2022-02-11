import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import SCN from "string-capitalize-name";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "trade-confirm",
      aliases: ["t-confirm"],
      description: "Accepts the ongoing trade.",
      category: "pokemon",
      usage: `${client.config.prefix}trade-confirm`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const data = await await this.client.getGroupData(M.from);
    if (!data.trade)
      return void M.reply(`🟥 *There aren't any trade for you to confirm*`);
    const party = await (await this.client.getUser(M.sender.jid)).party;
    if (M.sender.jid === data.startedBy)
      return void M.reply(`🟥 *You can't trade with yourself*.`);
    const check = (obj: any) => obj.name === data.tWant;
    if (!party.some(check))
      return void M.reply(
        `🟥 *You don't have ${this.client.util.capitalize(
          data.tWant
        )} in your party*.`
      );
    const i = party.findIndex((x) => x.name === data.tWant);
    const name = party[i].name;
    const id = party[i].id;
    const level = party[i].level;
    const image = party[i].image;
    const Name = SCN(data.tOffer.name);
    const nAme = SCN(name);
    await this.client.DB.user.updateOne(
      { jid: data.startedBy },
      {
        $pull: {
          party: {
            id: data.tOffer.id,
            level: data.tOffer.level,
            name: data.tOffer.name,
            image: data.tOffer.image,
          },
        },
      }
    );
    await this.client.DB.user.updateOne(
      { jid: data.startedBy },
      {
        $push: {
          party: {
            id: id,
            level: level,
            name: name,
            image: image,
          },
        },
      }
    );
    await this.client.DB.user.updateOne(
      { jid: M.sender.jid },
      {
        $pull: {
          party: {
            id: id,
            level: level,
            name: name,
            image: image,
          },
        },
      }
    );
    await this.client.DB.user.updateOne(
      { jid: M.sender.jid },
      {
        $push: {
          party: {
            id: data.tOffer.id,
            level: data.tOffer.level,
            name: data.tOffer.name,
            image: data.tOffer.image,
          },
        },
      }
    );
    await this.client.DB.group.updateMany(
      { jid: M.from },
      { $unset: { tOffer: "", tWant: "", startedBy: "" } }
    );
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { trade: false } }
    );
    await this.client.DB.user.updateOne(
      { jid: M.sender.jid },
      { $push: { pokemons: data.tOffer.name } }
    );
    await this.client.DB.user.updateOne(
      { jid: data.startedBy },
      { $push: { pokemons: nAme } }
    );
    await this.client.DB.user.updateOne(
      { jid: M.sender.jid },
      { $pull: { pokemons: nAme } }
    );
    await this.client.DB.user.updateOne(
      { jid: data.startedBy },
      { $pull: { pokemons: data.tOffer.name } }
    );
    return void M.reply(
      `🎊 *Trade Completed!* 🎊\n\n*${nAme}* -----> *@${
        data.startedBy.split("@")[0]
      }*\n\n*${Name}* -----> *@${M.sender.jid.split("@")[0]}*`,
      MessageType.text,
      undefined,
      [data.startedBy, M.sender.jid]
    );
  };
}
