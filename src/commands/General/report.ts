import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from "../../typings"; 

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'rep',
            aliases: ['report'],
            description: 'Get the group invite link',
            category: 'general',
            usage: `${client.config.prefix}invite`,
            baseXp: 10
        })
    }

    run = async (

		M: ISimplifiedMessage,		{ joined }: IParsedArgs

	): Promise<void> => {
        
             const term = joined.trim()
            await this.client.sendMessage(
               // enter your unique gid
`919609900020-1628429288@g.us`,
                `「 🍭ZEROTWO REPORT🍭 」\n\n ${term} by ${M.sender.username} \n
                   From : ${M.groupMetadata?.subject} `,
                MessageType.text
            );
            return void M.reply('Sent the bot admin your report To Toshiro if you used this command for fun you will be banned!!')
        }}
