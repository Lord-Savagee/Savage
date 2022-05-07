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
            command: 'megumin',
            description: `only made this command for Megumin simp`,
            aliases: ['megumin'],
            category: 'weeb',
            usage: `${client.config.prefix}megumin`,
            baseXp: 25
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        // fetch result of https://api.waifu.pics/sfw/megumin from the API using axios
        const { data } = await axios.get('https://api.waifu.pics/sfw/megumin')
        const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid
        let username = user === M.sender.jid ? M.sender.username : "";
				if (!username) {
					const contact = this.client.getContact(user);
					username =
						contact.notify ||
						contact.vname ||
						contact.name ||
						user.split("@")[0];
				}
        const buffer = await request.buffer(data.url).catch((e) => {
            return void M.reply(e.message)
        })
        while (true) {
            try {
                M.reply(
                    buffer || 'Could not fetch image. Please try again later',
                    MessageType.image,
                    undefined,
                    undefined,
                    `*${username} Lol you got caught while simping ✌️*\n`,
                    undefined
                ).catch((e) => {
                    console.log(`This Error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`)
                    // console.log('Failed')
                    M.reply(`Could not fetch image. Here's the URL: ${data.url}`)
                })
                break
            } catch (e) {
                // console.log('Failed2')
                M.reply(`Could not fetch image. Here's the URL : ${data.url}`)
                console.log(`This Error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`)
            }
        }
        return void null
    }
}
