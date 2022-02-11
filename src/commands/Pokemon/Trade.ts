import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import axios from "axios";
import { setTimeout } from "timers";
import { MessageType } from "@adiwajshing/baileys";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "trade",
      description: `Will start a trade for pokemon.`,
      aliases: ["t"],
      category: "pokemon",
      usage: `${client.config.prefix}trade [pokemon_index_number_in_your_party_that_you_wanna_give] [name_of_the_pokemon_that_you_want]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (await (await this.client.getGroupData(M.from)).trade)
      return void M.reply(
        `🟥 *There is already a trade ongoing for this group. Try again later.*`
      );
    const user = M.sender.jid;
    if (!joined)
      return void M.reply(
        `🟥 *Provide the pokemons. Example - :trade 4 pikachu*`
      );
    const terms: any = joined.trim().split(" ");
    const party = await (await this.client.getUser(user)).party;
    if (isNaN(terms[0]) || terms[0] > party.length || terms[0] > 6)
      return void M.reply(`Invalid party index number.`);
    const i = terms[1].toLowerCase();
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      console.log(data.name);
    } catch (error) {
      return void M.reply(`Invalid Pokemon name.`);
    }
    const buttons = [
      {
        buttonId: "trade-confirm",
        buttonText: {
          displayText: `${this.client.config.prefix}trade-confirm`,
        },
        type: 1,
      },
      {
        buttonId: "trade-delete",
        buttonText: { displayText: `${this.client.config.prefix}trade-delete` },
        type: 1,
      },
    ];
    const name = party[terms[0] - 1].name;
    const id = party[terms[0] - 1].id;
    const level = party[terms[0] - 1].level;
    const image = party[terms[0] - 1].image;
    await this.client.DB.group.updateMany(
      { jid: M.from },
      {
        $set: {
          "tOffer.name": name,
          "tOffer.id": id,
          "tOffer.level": level,
          "tOffer.image": image,
          trade: true,
          startedBy: M.sender.jid,
          tWant: i,
        },
      }
    );
    const text = `🧧 *Pokemon Trade Started* 🧧\n\n🍥 *Offer: ${this.client.util.capitalize(
      name
    )}*\n\n🔮 *For: ${this.client.util.capitalize(i)}*`;
    const buttonMessage: any = {
      contentText: `${text}`,
      footerText: "🎇 Beyond 🎇",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
    setTimeout(async () => {
      if (!(await this.client.getGroupData(M.from)).trade) return void null;
      await this.client.DB.group.updateMany(
        { jid: M.from },
        { $unset: { tOffer: "", tWant: "", startedBy: "" } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { trade: false } }
      );
      return void M.reply(`Pokemon trade cancelled.`);
    }, 60000);
  };
}
