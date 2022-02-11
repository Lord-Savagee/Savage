import { MessageType } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "pokemons",
      aliases: ["pokemons"],
      description: "Will display user's pokemons",
      category: "pokemon",
      usage: `${client.config.prefix}pokemon`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const data = await (await this.client.getUser(M.sender.jid)).pokemons;
    const user = M.sender.jid;
    let username = user === M.sender.jid ? M.sender.username : "";
    if (!username) {
      const contact = this.client.getContact(user);
      username =
        contact.notify || contact.vname || contact.name || user.split("@")[0];
    }
    if (data.length < 1)
      return void M.reply(`You haven't caught any pokemon yet.`);
    let text = `*${username}'s Pokemons*\n\n`;
    text += `💠 *Total Pokemons: ${data.length}*\n\n`;
    for (let i = 0; i < data.length; i++) {
      text += `*#${i + 1} ${this.client.util.capitalize(data[i])}*\n`;
    }
    const buttons = [
      {
        buttonId: "party",
        buttonText: { displayText: `${this.client.config.prefix}party` },
        type: 1,
      },
      {
        buttonId: "pc",
        buttonText: { displayText: `${this.client.config.prefix}pc` },
        type: 1,
      },
    ];
    interface buttonMessage {
      contentText: string;
      footerText: string;
      buttons: string[];
      headerType: number;
    }
    const buttonMessage: any = {
      contentText: `${text}`,
      footerText: "🎇 Beyond 🎇",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
