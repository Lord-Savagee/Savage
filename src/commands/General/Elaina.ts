/** @format */

import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
	constructor(client: WAClient, handler: MessageHandler) {
		super(client, handler, {
			command: "elaina",
			aliases:['ela'],
			description: "Displays the info",
			category: "general",
			usage: `${client.config.prefix}chitoge`,
                        modsOnly:true,
			baseXp: 200,
		});
	}

	run = async (M: ISimplifiedMessage): Promise<void> => {
		const chitoge =
			"https://telegra.ph/file/cc89e0dbcdc7bf9877603.mp4";
		return void this.client.sendMessage(
			M.from,
			{ url: chitoge },
			MessageType.video,
			{
				quoted: M.WAMessage,
				mimetype: Mimetype.gif,
				caption: `❤️ *Elaina* 🎊\n\n🍀 *Description: A WhatsApp Bot With Rich Creation Features.*\n\n🌐 *URL: https://github.com/savage341/Elaina-BOT* \n\n 📒 *Guide: https://github.com/Lord/Savage-Savage-Guides* \n`,
			}
		);
	};
}
