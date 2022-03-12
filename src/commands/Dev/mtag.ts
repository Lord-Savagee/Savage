import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, Mimetype } from "@adiwajshing/baileys";
import { Sticker, Categories, StickerTypes } from "wa-sticker-formatter";

export default class Command extends BaseCommand {
	constructor(client: WAClient, handler: MessageHandler) {
		super(client, handler, {
			command: "mtag",
			description: "Tags all users in group chat by owner",
			aliases: ["mall", "mtagall", "mping"],
			category: "dev",
			usage: `${client.config.prefix}mtag`,
			modsOnly: true,
			baseXp: 20,
		});
	}

	run = async (
		M: ISimplifiedMessage,
		{ joined }: IParsedArgs
	): Promise<void> => {
		const tem = joined.trim();
                        if (!joined)
			return void (await M.reply(
				`${tem}\n *- ᴹᵒᵈˢ*`,
				undefined,
				undefined,
				M.groupMetadata?.participants.map((user) => user.jid)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			).catch((reason: any) =>
				M.reply(`✖️ An error occurred, Reason: ${reason}`)
			));
		const term = joined.trim();
			return void (await M.reply(
				`${term}\n *- ᴹᵒᵈˢ*`,
				undefined,
				undefined,
				M.groupMetadata?.participants.map((user) => user.jid)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			).catch((reason: any) =>
				M.reply(`✖️ An error occurred, Reason: ${reason}`)
			));
		};
}
