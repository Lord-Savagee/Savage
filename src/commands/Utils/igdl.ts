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
            command: 'igdl',
            aliases: ['igdl', 'igpr'],
            description: 'Download the post/video from ig ',
            category: 'media',
            dm: true,
            usage: `${client.config.prefix}igdl [link]`
        })
    }
    // static count = 0
    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        
        if (!joined) return void M.reply('Provide the keywords you wanna search, Baka!')
        const chitoge = joined.trim()
        console.log(chitoge)
        const { data } = await axios.get(`https://hanzz-web.herokuapp.com/api/igdl?url=${chitoge}`)
        if (data.result.error) return void M.reply( await request.buffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIJBLGeoanLhbUyzTNXLXXRPUDjUuDKIS8g&usqp=CAU`),
        MessageType.image,
                    undefined,
                    undefined,
                    `*Sorry, couldn\'t find or some errors occurred*`,
                    undefined
                )
switch (data.result.medias[0].type) {
  case 'image':
    M.reply( await request.buffer(data.result.medias[0].url),
        MessageType.image,
                    undefined,
                    undefined,
                    `Here you go`,
                    undefined
                )
    break
  case 'video':
    M.reply( await request.buffer(data.result.medias[0].url),
       MessageType.video,
                    undefined,
                    undefined,
                    `Here you go`,
                    undefined
                )
    break
  default:
    M.reply("Invalid format")
}
    }
}
