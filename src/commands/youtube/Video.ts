import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
const ytdl = require('ytdl-core');
const Innertube = require('youtubei.js');
import { IParsedArgs, ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'get',
            description: 'Downloads given YT Video',
            category: 'media',
            aliases: ['get','url'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 10
        })
    }

    run = async (
		M: ISimplifiedMessage,
		{ joined }: IParsedArgs
	): Promise<void> => {
        if (!M.urls.length) return void M.reply('ðŸ”Ž Provide the URL of the YT video you want to download')
        const youtube = await new Innertube(); 
        const video = new YT(M.urls[0], 'video')
        const te = joined.trim();
        let id = await ytdl.getURLVideoID(te)
        const v = await youtube.getDetails(id);
        let text = `*Title*: ${v.title}
*🦋Channel*: ${v.metadata.channel_name}
*❤️Likes*: ${v.metadata.likes}
*💔Dislike*: ${v.metadata.dislikes}
*👀Views*: ${v.metadata.view_count}
*🧭Duration* (sec): ${v.metadata.length_seconds}
*📝Description*: ${v.description}`
        if (!video.validateURL()) return void M.reply(`Provide a Valid YT URL`)
        const { videoDetails } = await video.getInfo()
        M.reply('🚀Sending...')
        if (Number(videoDetails.lengthSeconds) > 1800)
            return void M.reply('Cannot download videos longer than 30 minutes')
        M.reply(await video.getBuffer(), MessageType.video, undefined, undefined, text, undefined).catch((reason: Error) =>
            M.reply(`An error occurred, Reason: ${reason}`)
        )
    }
}
