import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import ms from "parse-ms-js";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "divorce",
      description: `Divorces your haigusha`,
      category: "weeb",
      usage: `${client.config.prefix}divorce`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const user = M.sender.jid;
    const time = 60000;
    const cd = await (await this.client.getCd(user)).divorce;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you can use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    const l = await (await this.client.getUser(M.sender.jid)).haigusha;
    if (await !(await this.client.getUser(M.sender.jid)).married)
      return void M.reply(`You are already single.`);
    await this.client.DB.user.updateOne(
      { jid: M.sender.jid },
      {
        $set: {
          married: false,
        },
      }
    );
    await M.reply(`You divorced *${l.name}*.`);
  };
}
