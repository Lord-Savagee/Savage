import { MessageType } from '@adiwajshing/baileys'
import request from '../../lib/request'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'tiktok',
            aliases: ['tk'],
            description: 'Download video from tik-tok ',
            category: 'youtube',
            dm: false,
            usage: `${client.config.prefix}tk [url]`
        })
    }
    // static count = 0
     run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {    
        if (!joined) return void M.reply('Give me url of tiktok baka')
        const chitoge = joined.trim()
        console.log(chitoge)
        const { data } = await axios.get(`https://ravindumanoj-sew-api.herokuapp.com/main/download/tiktok?url=${chitoge}&apikey=RavinduManoj`)
        if ((data as { error: string }).error) return void (await M.reply('Sorry, couldn\'t find'))
        const buffer = await request.buffer(data.result.wm).catch((e) => {
            return void M.reply(e.message)
        })
        while (true) {
            try {
                M.reply(
                    buffer || '🌟 An error occurred. Please try again later',
                    MessageType.video,
                    undefined,
                    undefined,
                    `💐 *Result: ${chitoge} has been found*\n`,
                    undefined
                ).catch((e) => {
                    console.log(`This error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`)
                    // console.log('Failed')
                    M.reply(`🌟An error occurred. Please try again later.`)
                })
                break
            } catch (e) {
                // console.log('Failed2')
                M.reply(`An error occurred. Please try again later.`)
                console.log(`This error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`)
            }
        }
        return void null
    }
}
