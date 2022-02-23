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
            command: 'amazon',
            aliases: ['az', 'am', 'ama'],
            description: 'Searches the given items from Amazon. ',
            category: 'general',
            
            usage: `${client.config.prefix}amazon [title]`
        })
    }
    // static count = 0
    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        
        if (!joined) return void M.reply('✖ Provide an item name to search, Baka!')
        const chitoge = joined.trim()
        console.log(chitoge)
        const { data } = await axios.get(`https://leyscoders-api.herokuapp.com/api/amazon-search?q=${chitoge}&apikey=dappakntlll`)//api MIMINGANZ
        const buffer = await request.buffer(data.result.thumb).catch((e) => {
            return void M.reply(e.message)
        })
        while (true) {
            try {
                M.reply(
                    buffer || '✖ An error occurred. Please try again later',
                    MessageType.image,
                    undefined,
                    undefined,
                    `🛍️ The item has been found: *${chitoge}* found\n\n📶 *Url:* *${data.result.url}*\n⚡* Review:* ${data.result.review}\n🌟 *Rating:* ${data.result.rating}\n💶 *Price:* ${data.result.price}\n❄️ *Best_Seller:* ${data.result.best_seller}\n📝 *Dec:* ${data.result.item}\n`,
                    undefined
                ).catch((e) => {
                    console.log(`This error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`)
                    // console.log('Failed')
                    M.reply(`✖ An error occurred. Please try again later.`)
                })
                break
            } catch (e) {
                // console.log('Failed2')
                M.reply(`✖ An error occurred. Please try again later.`)
                console.log(`This error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`)
            }
        }
        return void null
    }
}