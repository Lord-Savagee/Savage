import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import marika from "@shineiichijo/marika";
import { setTimeout } from "timers";
import { MessageType } from "@adiwajshing/baileys";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "tchara",
      description: `Will start a trade for character.`,
      aliases: ["tchara"],
      category: "characters",
      usage: `${client.config.prefix}tchara [character_index_number_in_your_gallery_that_you_wanna_give] | [character_id_that_you_want]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (await (await this.client.getGroupData(M.from)).charaTrade.ongoing)
      return void M.reply(
        `🟥 *There is already a character trade ongoing for this group. Try again later.*`
      );
    const user = M.sender.jid;
    if (!joined)
      return void M.reply(
        `🟥 *Provide the characters. Example - ${this.client.config.prefix}tchara [character_index_number_in_your_gallery_that_you_wanna_give] [id_of_the_character_that_you_want]*`
      );
    const terms: any = joined.trim().split(" ");
    const id = terms[0]
    const Id = terms[1]
    const gallery = await (await this.client.getUser(user)).gallery;
    if (isNaN(id) || id > gallery.length || id < 1)
      return void M.reply(`Invalid gallery index number.`);
    if (!Id)
      return void M.reply(
        `Please provide the id of the character that you want.`
      );
    let chara;
    try {
      chara = await marika.getCharacterById(Id);
    } catch (error) {
      return void M.reply(`Invalid id.`);
    }
    const source = await marika.getCharacterAnime(chara.mal_id);
    const i = terms[0] - 1;
    const buttons = [
      {
        buttonId: "tchara-confirm",
        buttonText: {
          displayText: `${this.client.config.prefix}tchara-confirm`,
        },
        type: 1,
      },
      {
        buttonId: "tchara-delete",
        buttonText: {
          displayText: `${this.client.config.prefix}tchara-delete`,
        },
        type: 1,
      },
    ];
    const text = `Character trade started\n\nOffer: ${gallery[i].name} (From ${gallery[i].source})\n\nFor: ${chara.name} (From ${source[0].anime.title})`;
    const buttonMessage: any = {
      contentText: `${text}`,
      footerText: "🎇 Beyond 🎇",
      buttons: buttons,
      headerType: 1,
    };
    await this.client.DB.group.updateMany(
      { jid: M.from },
      {
        $set: {
          "charaTrade.ongoing": true,
          "charaTrade.startedBy": user,
          "charaTrade.for.id": chara.mal_id,
          "charaTrade.for.name": chara.name,
          "charaTrade.for.source": source[0].anime.title,
          "charaTrade.offer.id": gallery[i].id,
          "charaTrade.offer.name": gallery[i].name,
          "charaTrade.offer.image": gallery[i].image,
          "charaTrade.offer.about": gallery[i].about,
          "charaTrade.offer.source": gallery[i].source,
        },
      }
    );
    await M.reply(buttonMessage, MessageType.buttonsMessage);
    setTimeout(async () => {
      if (!(await this.client.getGroupData(M.from)).charaTrade.ongoing)
        return void null;
      await this.client.DB.group.updateMany(
        { jid: M.from },
        {
          $unset: {
            "charaTrade.startedBy": "",
            "charaTrade.for.id": "",
            "charaTrade.for.name": "",
            "charaTrade.for.source": "",
            "charaTrade.offer.id": "",
            "charaTrade.offer.name": "",
            "charaTrade.offer.image": "",
            "charaTrade.offer.about": "",
            "charaTrade.offer.source": "",
          },
        }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { "charaTrade.ongoing": false } }
      );
      return void M.reply(`Character trade cancelled.`);
    }, 60000);
  };
}
