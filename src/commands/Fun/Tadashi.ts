import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'tada',
            description: 'Chat with bot.',
            aliases: ['tada'],
            category: 'fun',
            usage: `${client.config.prefix}tada [city or state name]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply(' *Baka!* ')
        const chitoge = joined.trim()
        await axios.get(`https://api.simsimi.net/v2/?text=${chitoge}&lc=en`)
        .then((response) => {
                // console.log(response);
                const text = `🎍 *Bot*:  ${response.data.success}`
                M.reply(text);
            }).catch(err => {
                M.reply(` *Baka!* `)
            }
            )
    };
}
