import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import {  IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'broadcast',
            description: 'Sends msg to all group chats',
            aliases: ['BC', 'announcement','bc'],
            category: 'dev',
            usage: `${client.config.prefix}broadcast`,
            modsOnly: true,
            baseXp: 0
        })
    }

    run = async (M: ISimplifiedMessage,  { joined }: IParsedArgs): Promise<void> => {
        
        const term = joined.trim();
        const chats:any= this.client.chats.all().filter(v => !v.read_only && !v.archive).map(v => v.jid).map(jids => jids.includes("g.us")? jids : null).filter(v=>v);
        for(let i =0;i<chats.length;i++){
        const text = `*「 𝖠𝗌𝗎𝗇𝖺🈲 𝖡𝗋𝗈𝖺𝖽𝖼𝖺𝗌𝗍 」* \n 📪𝗠𝗲𝘀𝘀𝗮𝗴𝗲: \n${term} \n 🪶𝗔𝘂𝘁𝗵𝗼𝗿: ${M.sender.username}`
        this.client.sendMessage(chats[i], text,MessageType.text,{contextInfo : {mentionedJid : M.groupMetadata?.participants.map((user) => user.jid) }})
        }
    }
}
