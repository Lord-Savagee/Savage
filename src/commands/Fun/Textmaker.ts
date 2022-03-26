import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ICommand, IParsedArgs, ISimplifiedMessage } from '../../typings'
import { MessageType, Mimetype } from '@adiwajshing/baileys'
import request from '../../lib/request'


export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'textmaker',
            description: 'Displays the textmaker menu',
            category: 'fun',
            usage: `${client.config.prefix}textmaker`,
            aliases: ['textpro','creation']
        })
    }

    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
            const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid
         const n = [
            'https://telegra.ph/file/0dda7046f0f436a110853.mp4'
        ]
        let rin = n[Math.floor(Math.random() * n.length)]
        if (!parsedArgs.joined) {
            const commands = this.handler.commands.keys()
            const categories: { [key: string]: ICommand[] } = {}
            for (const command of commands) {
                const info = this.handler.commands.get(command)
                if (!command) continue
                if (!info?.config?.category || info.config.category === 'dev' || info.config.category === 'weeb' || info.config.category === 'moderation' || info.config.category === 'media' || info.config.category === 'utils' || info.config.category === 'general' || info.config.category === 'fun' || info.config.category === 'educative' || info.config.category === 'framework') continue
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info)
                else {
                    categories[info.config.category] = []
                    categories[info.config.category].push(info)
                }
            }

            let text = `
「*text maker commands*
 ╚━❰☠︎︎: *${M.sender.username}*」
\n`
            const keys = Object.keys(categories)
            for (const key of keys)
              text += ` \`\`𖣘߷*${categories [
                    key
                ]
                    .map((command) => command.config?.command)
                    .join('☠︎︎✞︎\n💠')}\`\`n`
            return void this.client.sendMessage(M.from, { url: rin }, MessageType.video, {quoted:M.WAMessage,
            mimetype: Mimetype.gif,
            caption: `${text}` }
            )
        } 
        
    }
}
