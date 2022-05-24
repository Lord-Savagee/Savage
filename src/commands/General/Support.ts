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
        `    ♥️𝗠𝘆 𝗺𝗮𝘀𝘁𝗲𝗿'𝘀 𝗴𝗿𝗼𝘂𝗽 𝗹𝗶𝗻𝗸𝘀♥️
        
       *♥️𝔼𝕝𝕒𝕚𝕟𝕒 ℂ𝕒𝕤𝕚𝕟𝕠:♥️* *https://chat.whatsapp.com/BQ0vrEPOfb20UZ6s9Guhfj:*
        *♥️𝔹𝕠𝕥 𝕆𝕡𝕖𝕣𝕒𝕥𝕚𝕠𝕟♥️* INVITE LINK🎉:*https://chat.whatsapp.com/HtoSplfUFc87lJ1Xqh14WP*`,
           MessageType.text
        ))
        const n = [
            'https://telegra.ph/file/90c8d596818e948cc6a82.mp4'
        ]
        let beckylynch = n[Math.floor(Math.random() * n.length)]
        return void this.client.sendMessage(M.from, { url:beckylynch }, MessageType.video, {quoted:M.WAMessage,
            mimetype: Mimetype.gif,
            caption: `Sent you the support Link in personal message \n` }
        )

        }
}
