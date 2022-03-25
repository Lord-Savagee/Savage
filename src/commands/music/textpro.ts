import { MessageType, Mimetype } from '@adiwajshing/baileys'
import { join } from 'path'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'help8',
            description: 'Displays the help menu or shows the info of the command provided',
            category: 'extras',
            usage: `${client.config.prefix}help8 (command_name)`,
            dm: true,
            aliases: ['h8']
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        const n = [
            'https://telegra.ph/file/3666b3ce6e95ba3e8e6c4.mp4'
        ]
        let well = n[Math.floor(Math.random() * n.length)]
        return void this.client.sendMessage(M.from, { url: well }, MessageType.video, {quoted:M.WAMessage,
            mimetype: Mimetype.gif,
            caption: `-Creation 🄻🄸🅂🅃💙🌟
──────────────
🔮 ${this.client.config.prefix}tneon
🔮 ${this.client.config.prefix}greenneon
🔮 ${this.client.config.prefix}gem
🔮 ${this.client.config.prefix}tech
🔮 ${this.client.config.prefix}lovewall
🔮 ${this.client.config.prefix}holographic
🔮 ${this.client.config.prefix}devil
🔮 ${this.client.config.prefix}thunder
🔮 ${this.client.config.prefix}glitch
🔮 ${this.client.config.prefix}horror
🔮 ${this.client.config.prefix}Harrypotter
🔮 ${this.client.config.prefix}cloud
🔮 ${this.client.config.prefix}firework
🔮 ${this.client.config.prefix}blood
🔮 ${this.client.config.prefix}luxury
🔮 ${this.client.config.prefix}pencil
🔮 ${this.client.config.prefix}metal
🔮 ${this.client.config.prefix}silvertext
🔮 ${this.client.config.prefix}watercolor
🔮 ${this.client.config.prefix}3dt
🔮 ${this.client.config.prefix}3dchrome
🔮 ${this.client.config.prefix}pb
🔮 ${this.client.config.prefix}blackmetal
🔮 ${this.client.config.prefix}balloon
🔮 ${this.client.config.prefix}thoor
🔮 ${this.client.config.prefix}chocolate
🔮 ${this.client.config.prefix}silvertext
🔮 ${this.client.config.prefix}retroneon
🔮 ${this.client.config.prefix}captain
🔮 ${this.client.config.prefix}loveneon
🔮 ${this.client.config.prefix}advanceglow
🔮 ${this.client.config.prefix}3deepsea
🔮 ${this.client.config.prefix}graffiti
🔮 ${this.client.config.prefix}bokeh
🔮 ${this.client.config.prefix}berry
🔮 ${this.client.config.prefix}magma
🔮 ${this.client.config.prefix}mgalaxy
🔮 ${this.client.config.prefix}beach
💙 ${this.client.config.prefix}snow
💙 ${this.client.config.prefix}snowc
💙ENJOY_Made by Lord Savage 🕊️
┌────────────┈❅
│
│   💙 *Elaina*
│
│   *Lord Savage*🕊️
│
└────────────┈⁂

❅┈[𝐇𝐚𝐯𝐞 𝐆𝐫𝐞𝐚𝐭 𝐃𝐚𝐲]┈❅
──────────────` }
        )
    }
}
