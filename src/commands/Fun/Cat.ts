/** @format */ 

import MessageHandler from "../../Handlers/MessageHandler"
import BaseCommand from "../../lib/BaseCommand"
import WAClient from "../../lib/WAClient"
import { ISimplifiedMessage } from "../../typings"
import gen from "images-generator"
import request from "../../lib/request"
import { MessageType, Mimetype } from "@adiwajshing/baileys"
export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'cat',
            description: `Will send you random cute cat image.`,
            aliases: ['meow'],
            category: 'Fun',
            usage: `${client.config.prefix}cat`,
            baseXp: 50
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
      const URL = await gen.animal.cat()
      const buffer = await request.buffer(URL).catch((e) => {
            return void M.reply(e.message)
      })
      while (true) {
        try {
          M.reply(
            buffer || 'Could not fetch image. Please try again later',
            MessageType.image,
            undefined,
            undefined,
            `nya nya...\n`,
            undefined
          ).catch((e) => {
            console.log(
            `This Error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`
          );
          // console.log('Failed')
          M.reply(`Could not fetch image. Here's the URL: ${URL}`);
        });
        break;
      } catch (e) {
        // console.log('Failed2')
        M.reply(`Could not fetch image. Here's the URL : ${URL}`);
        console.log(
          `This Error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`
        );
      }
    }
    return void null;
  };
}
