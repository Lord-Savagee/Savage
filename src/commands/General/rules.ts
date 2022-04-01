/** @format */

import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "rules",
      description: "shows the rules for beyond",
      category: "general",
      usage: `${client.config.prefix}rules`,
      baseXp: 0,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const buttons = [
      {
        buttonId: "rules",
        buttonText: { displayText: `${this.client.config.prefix}rules` },
        type: 1,
      },
    ];

    const buttonMessage: any = {
      contentText: `🅴🅻🅰🅸🅽🅰\n\n 1.𝖠𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆𝗆𝗂𝗇𝗀/𝖼𝖺𝗅𝗅𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍.(𝖠𝗎𝗍𝗈 𝖡𝗅𝗈𝖼𝗄)\n\n 2.𝖠𝗏𝗈𝗂𝖽 𝖺𝗌𝗄𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝗇𝗒 𝗂𝗇𝗌𝗎𝗅𝗍𝗌/𝗇𝗎𝖽𝗂𝗍𝗒 𝖼𝗈𝗇𝗍𝖾𝗇𝗍.(𝖡𝖺𝗇)\n\n 3.𝖠𝗏𝗈𝗂𝖽 𝖼𝗁𝖺𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗂𝗇 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅 𝗆𝖾𝗌𝗌𝖺𝗀𝖾, 𝖮𝖭𝖫𝖸 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗇𝗄𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.(𝖡𝗅𝗈𝖼𝗄)\n\n 4.𝖴𝗌𝖾 !𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗇𝗄.\n\n 5.𝖭𝖾𝖾𝖽 𝗆𝖾 𝗂𝗇 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉? 𝖲𝖾𝗇𝖽 𝗅𝗂𝗇𝗄 𝗂𝗇 𝗆𝗒 𝖣𝖬 𝗈𝗋 𝗍𝗈 𝗆𝗒 𝗈𝗐𝗇𝖾𝗋.\n\n 6.𝖡𝗈𝗍 𝖬𝖴𝖲𝖳 𝖻𝖾 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇 𝗈𝖿 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉.\n\n 7.𝖡𝗈𝗍 𝗐𝗂𝗅𝗅 𝗃𝗈𝗂𝗇 𝖺 𝗀𝗋𝗈𝗎𝗉 𝗐𝗂𝗍𝗁 50+ 𝗆𝖾𝗆𝖻𝖾𝗋𝗌.\n\n 8.𝖡𝗈𝗍 𝗐𝗂𝗅𝗅 𝗇𝗈𝗍 𝗃𝗈𝗂𝗇 𝖻𝖺𝖼𝗄 𝗂𝗇 𝖺 𝗀𝗋𝗈𝗎𝗉 𝗐𝗁𝖾𝗋𝖾 𝗂𝗍 𝗐𝖺𝗌 𝗋𝖾𝗆𝗈𝗏𝖾𝖽.\n\n 9.𝖡𝗈𝗍 𝗐𝗂𝗅𝗅 𝗅𝖾𝖺𝗏𝖾 𝗂𝗇𝖺𝖼𝗍𝗂𝗏𝖾 & 𝖽𝖾𝖺𝖽 𝗀𝗋𝗈𝗎𝗉𝗌.\n\n 10.𝖭𝗌𝖿𝗐 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖺𝗋𝖾 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽 𝖺𝗌 𝗐𝖾 𝖽𝗈𝗇'𝗍 𝖺𝗅𝗅𝗈𝗐/𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝗀𝗋𝖺𝗉𝗁𝗂𝖼 𝖼𝗈𝗇𝗍𝖾𝗇𝗍.\n\n`,
      footerText: "©🅴🅻🅰🅸🅽🅰 2022",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
