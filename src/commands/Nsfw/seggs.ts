import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "seggs",
      description: `you will have seggs`,
      category: "nsfw",
      usage: `${client.config.prefix}seggs [tag user]`,
      baseXp: 50,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    if (!(await this.client.getGroupData(M.from)).nsfw)
      return void M.reply(
        `Don't be a pervert, Baka! This is not an NSFW group.`
      );

    const percentage = Math.floor(Math.random() * 100);
    let sentence;
    if (percentage < 25) {
      sentence = `\t\t\t\t\t*childbirth : ${percentage}%* \n\t\tYou're just horny not fated to be together. The partner Fainted`;
    } else if (percentage < 50) {
      sentence = `\t\t\t\t\t*childbirth : ${percentage}%* \n\t\tI't appears that you are still a noob about this subject`;
    } else if (percentage < 75) {
      sentence = `\t\t\t\t\t*childbirth : ${percentage}%* \n\t\t\tNot bad try harder`;
    } else if (percentage < 90) {
      sentence = `\t\t\t\t\t*childbirth : ${percentage}%* \n\tWoah I also learned something from that`;
    } else {
      sentence = `\t\t\t\t\t*childbirth : ${percentage}%* \n\tThe baby is waiting to see the world for sure`;
    }

    if (M.quoted?.sender && !M.mentioned.includes(M.quoted.sender))
      M.mentioned.push(M.quoted.sender);
    while (M.mentioned.length < 2) M.mentioned.push(M.sender.jid);
    const user1 = M.mentioned[0];
    const user2 = M.mentioned[1];
    const data = JSON.parse(
      (this.client.assets.get("seggs") as Buffer)?.toString()
    ) as unknown as {
      seggsJson: {
        id: number;
        seggsPercent: string;
        gifLink: string;
      }[];
    };

    const seggs = data.seggsJson.filter((seggs) => {
      const seggsPercent = parseInt(seggs.seggsPercent);
      return Math.abs(seggsPercent - percentage) <= 10;
    });
    // choose a random gif from the array
    const gifLink = seggs[Math.floor(Math.random() * seggs.length)].gifLink;
    let caption = `\t *KWAII SEGGS?*  \n`;
    caption += `\t\t---------------------------------\n`;
    caption += `@${user1.split("@")[0]}  x  @${user2.split("@")[0]}\n`;
    caption += `\t\t---------------------------------\n`;
    caption += `${sentence}`;

    return void M.reply(
      await this.client.util.GIFBufferToVideoBuffer(
        await this.client.getBuffer(gifLink)
      ),
      MessageType.video,
      Mimetype.gif,
      [user1, user2],
      caption
    );
  };
}
