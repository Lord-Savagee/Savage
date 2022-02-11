import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "tchara-confirm",
      description: "Confirms the ongoing character trade of the group.",
      category: "characters",
      usage: `${client.config.prefix}tchara-confirm`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const data = await (await this.client.getGroupData(M.from)).charaTrade;
    if (!data.ongoing)
      return void M.reply(
        `There aren't any character trade around for you to confirm.`
      );
    const user = M.sender.jid;
    const gallery = await (await this.client.getUser(user)).gallery;
    if (data.startedBy === user)
      return void M.reply(`You can't trade with yourself.`);
    const check = (obj: any) => obj.id === data.for.id;
    if (!gallery.some(check))
      return void M.reply(`You don't have that character.`);
    const i = gallery.findIndex((x) => x.id === data.for.id);
    await this.client.DB.user.updateMany(
      { jid: user },
      {
        $pull: {
          gallery: {
            id: gallery[i].id,
            name: gallery[i].name,
            image: gallery[i].image,
            about: gallery[i].about,
            source: gallery[i].source,
          },
        },
      }
    );
    await this.client.DB.user.updateMany(
      { jid: data.startedBy },
      {
        $pull: {
          gallery: {
            id: data.offer.id,
            name: data.offer.name,
            image: data.offer.image,
            about: data.offer.about,
            source: data.offer.source,
          },
        },
      }
    );
    await this.client.DB.user.updateMany(
      { jid: user },
      {
        $push: {
          gallery: {
            id: data.offer.id,
            name: data.offer.name,
            image: data.offer.image,
            about: data.offer.about,
            source: data.offer.source,
          },
        },
      }
    );
    await this.client.DB.user.updateMany(
      { jid: data.startedBy },
      {
        $push: {
          gallery: {
            id: gallery[i].id,
            name: gallery[i].name,
            image: gallery[i].image,
            about: gallery[i].about,
            source: gallery[i].source,
          },
        },
      }
    );
    setTimeout(async () => {
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
      return void M.reply(
        `Trade Completed! ${data.for.name} (From ${data.for.source}) -----> @${
          data.startedBy.split("@")[0]
        }\n${data.offer.name} (From ${data.offer.source}) -----> @${
          user.split("@")[0]
        }`,
        MessageType.text,
        undefined,
        [data.startedBy, user]
      );
    }, 2000);
  };
}
