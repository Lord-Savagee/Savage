import { getRandomQuiz, getQuizById } from "anime-quiz";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, Mimetype } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "quiz",
      description: `Will give you a random anime quiz to answer.`,
      aliases: ["start-quiz"],
      category: "games",
      usage: `${client.config.prefix}quiz`,
      baseXp: 10,
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
    const term = joined.trim().split(" ");
    if (term[0] === "--ff" || term[0] === "--forfeit") {
      if (await (await this.client.getGroupData(M.from)).quizResponse.ongoing) {
        if (
          (await (
            await this.client.getGroupData(M.from)
          ).quizResponse.startedBy) !== M.sender.jid
        )
          return void M.reply(`You can't forfeit this quiz.`);
        await this.client.DB.group.updateOne(
          { jid: M.from },
          { $set: { "quizResponse.ongoing": false } }
        );
        return void M.reply(`You forfeited the quiz.`);
      } else {
        return void M.reply(`There are no quiz ongoing.`);
      }
    }
    if (await (await this.client.getGroupData(M.from)).quizResponse.ongoing)
      return void M.reply(
        `A quiz is already going on. Use *${this.client.config.prefix}quiz --ff* to forfeit this quiz.`
      );
    const quiz = await getRandomQuiz();
    let text = `🎀 *Question: ${quiz.question}*\n\n`;
    for (let i = 0; i < quiz.options.length; i++) {
      text += `*${i + 1}) ${quiz.options[i]}*\n`;
    }
    text += `\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*\n\n`;
    text += `📒 *Note: You only have 60 seconds to answer.*`;
    await this.client.DB.group.updateMany(
      { jid: M.from },
      {
        $set: {
          "quizResponse.id": quiz.id,
          "quizResponse.ongoing": true,
          "quizResponse.answer": quiz.answer[1],
          "quizResponse.startedBy": M.sender.jid,
        },
      }
    );
    if (quiz.image === null && quiz.gif === null) {
      await M.reply(text);
    } else if (quiz.gif === null) {
      await M.reply(
        await this.client.getBuffer(quiz.image),
        MessageType.image,
        undefined,
        undefined,
        text
      );
    } else {
      await M.reply(
        await this.client.util.GIFBufferToVideoBuffer(
          await this.client.getBuffer(quiz.gif)
        ),
        MessageType.video,
        Mimetype.gif,
        undefined,
        text
      );
    }
    setTimeout(async () => {
      if (await !(await this.client.getGroupData(M.from)).quizResponse.ongoing)
        return void null;
      const id = await (await this.client.getGroupData(M.from)).quizResponse.id;
      const g = await getQuizById(id);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { "quizResponse.ongoing": false } }
      );
      return void M.reply(
        `🕕 Timed out! The correct answer was *${g.answer[1]}) ${g.answer[0]}.*`
      );
    }, 90000);
  };
}
