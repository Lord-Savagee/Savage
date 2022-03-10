import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'
import request from '../../lib/request'
import { MessageType } from '@adiwajshing/baileys'
// import { MessageType, Mimetype } from '@adiwajshing/baileys'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'mifi',
            description: `Will send you random mifi img.`,
            aliases: ['mifi'],
            category: 'nsfw',
            usage: `${client.config.prefix}mifi`,
            baseXp: 50
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
         if (!(await this.client.getGroupData(M.from)).nsfw)
         return void M.reply(
        `Don't be a pervert, Baka! This is not an NSFW group.`
         );
        // fetch result of https://velgrynd.herokuapp.com/api/randomimage/milf?apikey=Kuxw2RRu from the API using axios
        return void M.reply( await request.buffer(`https://velgrynd.herokuapp.com/api/randomimage/milf?apikey=jxhcCGrCtIavLMAe6JY8xrwTX`),
        MessageType.image,
                    undefined,
                    undefined,
                    `🌟 Here you go.\n`,
                    undefined
                ).catch((reason: any) =>
            M.reply(`✖ An error occurred. Please try again later.`))
    }
}
