import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'shorturl',
            description: 'Short your given url.',
            aliases: ['srurl'],
            category: 'utils',
            usage: `${client.config.prefix}shorturl [Your url]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('Give me a website link baka')
        const chitoge = joined.trim()
        await axios.get(`https://leyscoders-api.herokuapp.com/api/tinyurl?url=${chitoge}&apikey=dappakntlll`)
        .then((response) => {
                // console.log(response);
                const text = `🌐 *Your url* :${response.data.result}`
                M.reply(text);
            }).catch(err => {
                M.reply(`Sorry something went wrong.`)
            }
            )
    };
}
