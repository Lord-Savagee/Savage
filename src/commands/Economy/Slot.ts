import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import ms from "parse-ms-js";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "slot",
      description: "Bet your gold here.",
      aliases: ["bet"],
      category: "economy",
      usage: `${client.config.prefix}bet <amount>`,
      baseXp: 30,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (M.from !== "120363022488307199@g.us")
      return void M.reply(
        `You can't bet here. Use ${this.client.config.prefix}support to get casino group link.`
      );
    const user = M.sender.jid;
    const time = 45000;
    const cd = await (await this.client.getCd(user)).slot;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down. You can bet again in *${timeLeft.seconds} second(s)*`
      );
    }
    const emojis = [
      "\t\t🌸 : 💮 : 🌸\n》 💮 : ☘ : 💮 《\n\t\t☘ : ☘ : 🌸",
      "\t\t☘ : ☘ : 🌸\n》 💮 : ☘ : 🌸 《\n\t\t🌸 : 💮 : 💮",
      "\t\t🌸 : 🌸 : ☘\n》 💮 : ☘ : ☘ 《\n\t\t💮 : 💮 : 🌸",
    ];
    const i = emojis[Math.floor(Math.random() * emojis.length)];
    const Emoji = [
      "\t\t🌸 : 💮 : 💮\n》 ☘ : ☘ : ☘ 《\n\t\t☘ : 🌸 : 🌸",
      "\t\t☘ : 🌸 : ☘\n》 💮 : 💮 : 💮 《\n\t\t☘ : 🌸 : 🌸",
      "\t\t💮 : ☘ : 💮\n》 🌸 : 🌸 : 🌸 《\n\t\t💮 : ☘ : ☘",
    ];
    const o = Emoji[Math.floor(Math.random() * Emoji.length)];
    const jack = [
      "\t\t🌸 : 🌸 : 🌸\n》 ☘ : ☘ : ☘ 《\n\t\t💮 : 💮 : 💮",
      "\t\t☘ : ☘ : ☘\n》 💮 : 💮 : 💮 《\n\t\t🌸 : 🌸 : 🌸",
      "\t\t💮 : 💮 : 💮\n》 🌸 : 🌸 : 🌸 《\n\t\t☘ : ☘ : ☘",
    ];
    const p = jack[Math.floor(Math.random() * jack.length)];
    const results = [
      "lose",
      "win",
      "lose",
      "lose",
      "lose",
      "lose",
      "lose",
      "win",
      "win",
      "win",
      "lose",
      "lose",
      "win",
      "jackpot",
    ];
    const z = results[Math.floor(Math.random() * results.length)];
    if (!joined)
      return void M.reply(
        `🟥 *Provide the amount of gold to bet. Usage Example - :slot 100.*`
      );
    const wallet = await (await this.client.getUser(user)).wallet;
    const terms: any = joined.trim().split(" ");
    const amount = terms[0];
    if (isNaN(amount)) return void M.reply(`🟥 *It must be a number*.`);
    if (amount < 100)
      return void M.reply(`🟥 *You can't bet gold less than 100.*`);
    if (amount > wallet)
      return void M.reply(
        `🟥 *You need ${
          amount - wallet
        } gold in your wallet to bet with this amount>*`
      );
    if (amount > 15000)
      return void M.reply(`🟥 *You can't bet more than 15000 gold*.`);
    const head = `🎰 *SLOT MACHINE* 🎰`;
    const buttons = [
      {
        buttonId: "wallet",
        buttonText: { displayText: `${this.client.config.prefix}wallet` },
        type: 1,
      },
    ];
    if (z === "lose") {
      await this.client.reduceGold(user, amount);
      await this.client.DB.cd.updateOne(
        { jid: user },
        { $set: { slot: Date.now() } }
      );
      const text = `${head}\n\n${i}\n\n📉 You lost *${amount} gold*.`;
      const buttonMessage: any = {
        contentText: `${text}`,
        footerText: "🎇 Beyond 🎇",
        buttons: buttons,
        headerType: 1,
      };
      await M.reply(buttonMessage, MessageType.buttonsMessage);
    }
    if (z === "win") {
      const i = Math.floor(Math.random() * 5);
      const gold = amount * i;
      await this.client.addGold(user, gold);
      await this.client.DB.cd.updateOne(
        { jid: user },
        { $set: { slot: Date.now() } }
      );
      const text = `${head}\n\n${o}\n\n📈 You won *${gold} gold*.`;
      const buttonMessage: any = {
        contentText: `${text}`,
        footerText: "🎇 Beyond 🎇",
        buttons: buttons,
        headerType: 1,
      };
      await M.reply(buttonMessage, MessageType.buttonsMessage);
    }
    if (z == "jackpot") {
      const gold = amount * 10;
      await this.client.addGold(user, gold);
      await this.client.DB.cd.updateOne(
        { jid: user },
        { $set: { slot: Date.now() } }
      );
      const text = `${head}\n\n${p}\n\n🎊 *Jackpot!* You won *${gold} gold*.`;
      const buttonMessage: any = {
        contentText: `${text}`,
        footerText: "🎇 Beyond 🎇",
        buttons: buttons,
        headerType: 1,
      };
      await M.reply(buttonMessage, MessageType.buttonsMessage);
    }
  };
}
