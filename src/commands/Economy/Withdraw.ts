import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, Mimetype } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "withdraw",
      description: "Withdraws gold from the bank",
      aliases: ["withdraw"],
      category: "economy",
      usage: `${client.config.prefix}withdraw <amount>`,
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
      return void M.reply(`Specify the amount of gold to withdraw, Baka!`);
    const amount: any = joined
      .trim()
      .split(" ")[0]
      .replace(/\-/g, "trewte")
      .replace(/\./g, "retre");
    if (isNaN(amount))
      return void M.reply(`The amount should be a number, Baka!`);
    const bank = await (await this.client.getUser(user)).bank;
    if (bank < amount)
      return void M.reply(
        `🟥 *You don't have sufficient amount of gold in your bank to make this transaction*.`
      );
    await this.client.withdraw(user, amount);

    const buttons = [
      {
        buttonId: "wallet",
        buttonText: { displayText: `${this.client.config.prefix}wallet` },
        type: 1,
      },
    ];

    const buttonMessage: any = {
      contentText: `You have withdrawn *${amount} gold* from your bank.`,
      footerText: "🎇 Beyond 🎇",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
