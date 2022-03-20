import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'casino',
            aliases: ['support,casino'],
            description: 'Gets the gambling group links',
            category: 'extras',
            usage: `${client.config.prefix}casino`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        (await this.client.sendMessage(
        M.sender.jid,
                `*🍁Casino Group🍁*\n\n
                 *Lord Savage🕊️: Fun Group*:https://chat.whatsapp.com/EOB2UescDz78rTYG4MQWe1\n\n
                 *Lord Savage🕊️ Gambling: 𝗖𝗮𝘀𝗶𝗻𝗼 *:https://chat.whatsapp.com/Gy1JemBGs9wLjVEfzbRJ21                      `,
           MessageType.text
        ))
        const n = [
            'https://telegra.ph/file/e44db02b0b240224a6bcc.mp4'
        ]
        let rin = n[Math.floor(Math.random() * n.length)]
        return void this.client.sendMessage(M.from, { url: rin }, MessageType.video, {quoted:M.WAMessage,
            mimetype: Mimetype.gif,
            caption: `Send you the support group links in Personal Message\n` }
        )

        }
}
