import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'
export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'ip',
            description: 'will tell the info of the given ip adress',
            aliases: ['ip'],
            category: 'utils',
            usage: `${client.config.prefix}ip [name]`
        })
    }
    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        
        
        
        if (!joined) return void M.reply('🔎 Provide a ip')
        const term = joined.trim()
        await axios.get(`https://ipapi.co/${term}/json/`)
        .then((response) => {
                // console.log(response);
                const text = `📊Info of IP- *${term}* is \n *🚦IP:* ${response.data.ip} \n *🛡️Version:* ${response.data.version} \n *🌍City:* ${response.data.city} \n *🌏Region:* ${response.data.region} \n *🌒Country:* ${response.data.country_name} \n *⭐latitude:* ${response.data.latitude} \n  *🎏longitude:* ${response.data.longitude} \n *🕒timezone:* ${response.data.timezone} \n *📈languages:* ${response.data.languages} \n *asn:* ${response.data.asn} \n *org:* ${response.data.org} `
                M.reply(text);
            })
            .catch(err => {
                M.reply(`🔍 Please provide a valid ip \n Error: ${err}`)
            }
            )
    };
}
