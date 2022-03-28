import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'support',
            aliases: ['support'],
            description: 'Gets the support group links',
            category: 'general',
            usage: `${client.config.prefix}Support`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        (await this.client.sendMessage(
        M.sender.jid,
                `*❤️𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗚𝗿𝗼𝘂𝗽𝘀❤️*\n\n
                 *「ZeroTwo & Nezuko: Official Support」*https://chat.whatsapp.com/Du66aGn1gOk1fDuPSJUEEp\n\n
                 *「ZeroTwo & Nezuko┐: 𝗖𝗮𝘀𝗶𝗻𝗼💰」*https://chat.whatsapp.com/D6rZK7bWb3iCTbLxqFlndh                      `,
           MessageType.text
        ))
        const n = [
            'https://telegra.ph/file/9bf85b0af7e1096532ee1.mp4'
        ]
        let rin = n[Math.floor(Math.random() * n.length)]
        return void this.client.sendMessage(M.from, { url: rin }, MessageType.video, {quoted:M.WAMessage,
            mimetype: Mimetype.gif,
            caption: `Send you the support group links in Personal Message\n` }
        )

        }
}
