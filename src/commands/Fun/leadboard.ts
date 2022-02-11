import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import request from "../../lib/request";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "gleaderboard",
      aliases: ["lb", "leaderboard"],
      description: "Shows global LeaderBoard",
      category: "fun",
      usage: `${client.config.prefix}lb (@tag)`,
      // aliases: ['exp'],
      baseXp: 10,
    });
  }
  run = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.quoted?.sender) M.mentioned.push(M.quoted.sender);
    const user: any = M.mentioned[0] ? M.mentioned[0] : M.sender.jid;
    //  console.log(  await this.client.cookieStats(user))
    // await DB.user.findOne({user})
    const lb = await this.client.DB.user.find().sort({ Xp: -1 }).limit(10);
    const indexes = await this.client.DB.user.count();
    console.log(lb, indexes);
    //   M.reply(JSON.stringify(lb));

    // M.reply('total user heuhue :'+indexes.toString())
    const message = ["_*BEYOND*_ :" + indexes.toString() + ""];
    const mention = [];
    let i = 0;
    for (const users of lb) {
      console.log(users.jid, "number");
      mention.push(users.jid);
      i++;
      console.log(i);
      const username = this.client.contacts[users.jid]
        ? this.client.contacts[users.jid].notify
        : this.client.contacts[users.jid]
        ? this.client.contacts[users.jid].vname
        : this.client.contacts[users.jid]
        ? this.client.contacts[users.jid].name
        : this.client.contacts[users.jid]
        ? this.client.contacts[users.jid].short
        : `@${users.jid.split("@")[0]}`;

      const text = `*#${i}*\n*🎆USER* : *${username}*\n*🎊 Experience*: *${users.Xp}*\n*🏦 Bank*: *${users.bank}*\n*🪙 Gold* : *${users.wallet}*\n♦️ *Pokemons: ${users.pokemons.length}*\n🎗 *Characters: ${users.gallery.length}*\n 🍀 *Quiz Points: ${users.quizPoints}*\n`;
      message.push(text);
    }
    console.log(message);
    M.reply(
      await request.buffer("https://wallpapercave.com/uwp/uwp1997564.jpeg"),
      MessageType.image,
      undefined,
      mention,
      message.join("\n\n")
    );
  };
}
