import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "answer",
      description: `Answer the last quiz sent by the bot.`,
      aliases: ["ans"],
      category: "games",
      usage: `${client.config.prefix}answer [your_answer]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (M.from !== "120363039941521242@g.us")
      return void M.reply(
        `You can't use this command here. Use ${this.client.config.prefix}support to get the quiz group link.`
      );
    if (await !(await this.client.getGroupData(M.from)).quizResponse.ongoing)
      return void M.reply(
        `There aren't any quiz for you to answer. Use *${this.client.config.prefix}quiz* to start a quiz.`
      );
    if (!joined) return void M.reply(`Provide the option number, Baka!`);
    const ans: any = joined.split("  ")[0];
    if (isNaN(ans)) return void M.reply(`The option type must be a number.`);
    if (ans > 5 || ans < 1) {
      return void M.reply(`Invalid option.`);
    }
    const id = await (await this.client.getGroupData(M.from)).quizResponse.id;
    const check = await (await this.client.getUser(M.sender.jid)).lastQuizId;
    const exp = Math.floor(Math.random() * 100);
    if (id === check) {
      return void M.reply(
        `You have recently attempted to answer this question, give it a break.`
      );
    }
    const correctAns = await (
      await this.client.getGroupData(M.from)
    ).quizResponse.answer;
    if (ans == correctAns) {
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { "quizResponse.ongoing": false } }
      );
      await this.client.DB.user.updateOne(
        { jid: M.sender.jid },
        { $inc: { quizPoints: 1 } }
      );
      await this.client.setXp(M.sender.jid, exp, 40);
      return void M.reply(
        `🎉 Correct answer. You have earned *${exp} experience*.`
      );
    } else if (ans !== correctAns) {
      await this.client.DB.user.updateOne(
        { jid: M.sender.jid },
        { $set: { lastQuizId: id } }
      );
      return void M.reply(`✖️ Wrong guess.`);
    }
  };
}
