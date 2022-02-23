import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "support",
      aliases: ["support"],
      description: "Gets the support group links",
      category: "general",
      usage: `${client.config.prefix}Support`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    await this.client.sendMessage(
      M.sender.jid,
      ` _*I'M FROM BEYOND 🎆*\n\n
        _*BEYOND NEWS*_:https://chat.whatsapp.com/KcjW4C4Zl46L1ECpot1FeO\n\n 
        _*WELCOME TO BEYOND*_:https://chat.whatsapp.com/HGH0SFq4w0B6IgSWJkgtt5\n\n
        _*BEYOND CASINO*_:https://chat.whatsapp.com/EmfhxmgQhNfIUxiE8NHCvq\n\n 
        _*BEYOND NSFW*_:https://chat.whatsapp.com/GSK6jAz783L107yJrjeV71
        _*BEYOND QUIZ*_:https://chat.whatsapp.com/F6gqHxiHImD1vi5oc3ExBf`,

      MessageType.text
    );

    return void M.reply("Sent you the Group Link in personal message");
  };
}
