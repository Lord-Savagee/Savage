import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, Mimetype } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "deposit",
      description: "Deposit your gold to bank",
      aliases: ["deposit"],
      category: "economy",
      usage: `${client.config.prefix}deposit <amount>`,
      baseXp: 20,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    const user = M.sender.jid;
    if (!joined)
      return void M.reply(`Specify the amount of gold to deposit, Baka!`);
    const amount: any = joined
      .trim()
      .split(" ")[0]
      .replace(/\-/g, "trewte")
      .replace(/\./g, "retre");
    if (isNaN(amount))
      return void M.reply(
        `*https://en.wikipedia.org/wiki/Number*\n\nI think this might help you.`
      );

    const wallet = await (await this.client.getUser(user)).wallet;
    const bank = await (await this.client.getUser(user)).bank;

    const buttons = [
      {
        buttonId: "bank",
        buttonText: { displayText: `${this.client.config.prefix}bank` },
        type: 1,
      },
    ];

    if (bank >= 5000000)
      return void M.reply(
        `🟥 *You can't have more than 5000000 gold in your bank*.`
      );
    if (wallet < amount)
      return void M.reply(
        `🟥 *You don't have sufficient amount of gold in your wallet to make this transaction*.`
      );
    await this.client.deposit(user, amount);
    const buttonMessage: any = {
      contentText: `You have transferred *${amount} gold* to your bank.`,
      footerText: "🎇 Beyond 🎇",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
