import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "give",
      description: "Give gold to someone.",
      aliases: ["give"],
      category: "economy",
      usage: `${client.config.prefix}give <amount> [tag/quote]`,
      baseXp: 30,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (!joined)
      return void M.reply(`Specify the amount of gold to give, Baka!`);
    const bruhh: any = joined.trim().split(" ");
    const amount: number = bruhh[0]
      .replace(/\-/g, "trewte")
      .replace(/\./g, "retre");
    if (isNaN(amount))
      return void M.reply(`The amount should be a number, Baka!`);
    const user = M.sender.jid;
    const target =
      M.quoted && M.mentioned.length === 0
        ? M.quoted.sender
        : M.mentioned[0] || null;
    if (!target || target === M.sender.jid)
      return void M.reply(`Good luck giving the gold of yours to yourself.`);
    const wallet = await (await this.client.getUser(user)).wallet;
    if (amount > wallet)
      return void M.reply(
        `🟥 *You need ${amount - wallet} gold more to make this transaction*.`
      );
    await this.client.reduceGold(user, amount);
    await this.client.addGold(target!, amount);
    await M.reply(
      `*@${user.split("@")[0]}* gave *${amount} gold* to *@${
        target?.split("@")[0]
      }*🎉`,
      MessageType.text,
      undefined,
      [user || "", target!]
    );
  };
}
