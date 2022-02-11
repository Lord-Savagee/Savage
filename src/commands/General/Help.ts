import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ICommand, IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, proto } from "@adiwajshing/baileys";
import request from "../../lib/request";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "help",
      description:
        "Displays the help menu or shows the info of the command provided",
      category: "general",
      usage: `${client.config.prefix}help (command_name)`,
      aliases: ["h"],
      baseXp: 30,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    parsedArgs: IParsedArgs
  ): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    /*eslint-disable @typescript-eslint/no-unused-vars*/
    const user = M.sender.jid;
    if (!parsedArgs.joined) {
      const commands = this.handler.commands.keys();
      const categories: { [key: string]: ICommand[] } = {};
      for (const command of commands) {
        const info = this.handler.commands.get(command);
        if (!command) continue;
        if (!info?.config?.category || info.config.category === "dev") continue;
        if (
          !info?.config?.category ||
          (info.config.category === "nsfw" &&
            !(await this.client.getGroupData(M.from)).nsfw)
        )
          continue;
        if (Object.keys(categories).includes(info.config.category))
          categories[info.config.category].push(info);
        else {
          categories[info.config.category] = [];
          categories[info.config.category].push(info);
        }
      }
      let text = `🎉Hi There *@${
        user.split("@")[0]
      }*, I'm _*${this.client.user.name}*_.\n\nMy prefix is - "${
        this.client.config.prefix
      }"\n\nThe usable commands are listed below.\n\n`;
      const keys = Object.keys(categories);
      for (const key of keys)
        text += `*━━━❰ ${this.client.util.capitalize(
          key
        )} ❱━━━*\n \`\`\`${categories[key]
          .map((command) => command.config?.command)
          .join(", ")}\`\`\`\n\n`;
      const coding = [{ title: "github", rowId: "rowid1" }];
      const economy = [
        { title: "bank", rowId: "rowid1" },
        { title: "daily", rowId: "rowid2" },
        { title: "deposit", rowId: "rowid2" },
        { title: "gamble", rowId: "rowid2" },
        { title: "give", rowId: "rowid2" },
        { title: "rob", rowId: "rowid2" },
        { title: "slot", rowId: "rowid2" },
        { title: "wallet", rowId: "rowid2" },
        { title: "weekly", rowId: "rowid2" },
        { title: "withdraw", rowId: "rowid2" },
      ];
      const educative = [
        { title: "calculator", rowId: "rowid1" },
        { title: "crypto", rowId: "rowid2" },
        { title: "element", rowId: "rowid2" },
        { title: "trivia", rowId: "rowid2" },
        { title: "urbandictionary", rowId: "rowid2" },
      ];
      const fun = [
        { title: "rip", rowId: "rowid1" },
        { title: "fact", rowId: "rowid2" },
        { title: "jail", rowId: "rowid2" },
        { title: "joke", rowId: "rowid2" },
        { title: "quote", rowId: "rowid2" },
        { title: "react", rowId: "rowid2" },
        { title: "ship", rowId: "rowid2" },
        { title: "why", rowId: "rowid2" },
        { title: "trash", rowId: "rowid2" },
        { title: "trigger", rowId: "rowid2" },
        { title: "wanted", rowId: "rowid2" },
      ];
      const games = [
        { title: "answer", rowId: "rowid1" },
        { title: "chess", rowId: "rowid2" },
        { title: "quiz", rowId: "rowid2" },
      ];
      const general = [
        { title: "admins", rowId: "rowid1" },
        { title: "chat", rowId: "rowid2" },
        { title: "help", rowId: "rowid2" },
        { title: "support", rowId: "rowid2" },
        { title: "hi", rowId: "rowid2" },
        { title: "hg", rowId: "rowid2" },
        { title: "invitelink", rowId: "rowid2" },
        { title: "mods", rowId: "rowid2" },
        { title: "profile", rowId: "rowid2" },
        { title: "exp", rowId: "rowid2" },
        { title: "leaderboard", rowId: "rowid2" },
        { title: "rank", rowId: "rowid2" },
        { title: "info", rowId: "rowid2" },
      ];
      const media = [
        { title: "karaoke", rowId: "rowid1" },
        { title: "lyrics", rowId: "rowid2" },
        { title: "play", rowId: "rowid2" },
        { title: "spotify", rowId: "rowid2" },
        { title: "ytaudio", rowId: "rowid2" },
        { title: "ytsearch", rowId: "rowid2" },
        { title: "ytvideo", rowId: "rowid2" },
      ];
      const moderation = [
        { title: "act", rowId: "rowid1" },
        { title: "close", rowId: "rowid2" },
        { title: "enable", rowId: "rowid2" },
        { title: "disable", rowId: "rowid2" },
        { title: "delete", rowId: "rowid2" },
        { title: "demote", rowId: "rowid2" },
        { title: "everyone", rowId: "rowid2" },
        { title: "groupchange", rowId: "rowid2" },
        { title: "open", rowId: "rowid2" },
        { title: "groupchange", rowId: "rowid2" },
        { title: "open", rowId: "rowid2" },
        { title: "promote", rowId: "rowid2" },
        { title: "purge", rowId: "rowid2" },
        { title: "remove", rowId: "rowid2" },
        { title: "revoke", rowId: "rowid2" },
      ];
      const nsfw = [
        { title: "anal", rowId: "rowid1" },
        { title: "blowjob", rowId: "rowid2" },
        { title: "maid", rowId: "rowid2" },
        { title: "masturbation", rowId: "rowid2" },
        { title: "nsfwdoujin", rowId: "rowid2" },
        { title: "nhentai", rowId: "rowid2" },
        { title: "nsfwkitsune", rowId: "rowid2" },
        { title: "nsfwneko", rowId: "rowid2" },
        { title: "nsfwpaper", rowId: "rowid2" },
        { title: "nsfwwaifu", rowId: "rowid2" },
        { title: "pussy", rowId: "rowid2" },
        { title: "thighs", rowId: "rowid2" },
        { title: "seggs", rowId: "rowid2" },
      ];
      const pokemon = [
        { title: "catch", rowId: "rowid1" },
        { title: "party", rowId: "rowid2" },
        { title: "pc", rowId: "rowid2" },
        { title: "pokemons", rowId: "rowid2" },
        { title: "t2party", rowId: "rowid2" },
        { title: "t2pc", rowId: "rowid2" },
        { title: "trade", rowId: "rowid2" },
        { title: "trade-confirm", rowId: "rowid2" },
        { title: "trade-delete", rowId: "rowid2" },
        { title: "swap", rowId: "rowid2" },
      ];
      const characters = [
        { title: "claim", rowId: "rowid1" },
        { title: "gallery", rowId: "rowid2" },
        { title: "schara", rowId: "rowid2" },
      ];
      const utils = [
        { title: "blur", rowId: "rowid1" },
        { title: "circle", rowId: "rowid2" },
        { title: "getgif", rowId: "rowid2" },
        { title: "google", rowId: "rowid2" },
        { title: "retrieve", rowId: "rowid2" },
        { title: "screenshot", rowId: "rowid2" },
        { title: "steal", rowId: "rowid2" },
        { title: "sticker", rowId: "rowid2" },
        { title: "subred", rowId: "rowid2" },
        { title: "toimg", rowId: "rowid2" },
        { title: "translate", rowId: "rowid2" },
        { title: "weather", rowId: "rowid2" },
        { title: "wiki", rowId: "rowid2" },
      ];
      const weeb = [
        { title: "anime", rowId: "rowid1" },
        { title: "animepaper", rowId: "rowid2" },
        { title: "animequote", rowId: "rowid2" },
        { title: "character", rowId: "rowid2" },
        { title: "characterid", rowId: "rowid2" },
        { title: "divorce", rowId: "rowid2" },
        { title: "genshincharacter", rowId: "rowid2" },
        { title: "haigusha", rowId: "rowid2" },
        { title: "kitsune", rowId: "rowid2" },
        { title: "loli", rowId: "rowid2" },
        { title: "marry", rowId: "rowid2" },
        { title: "manga", rowId: "rowid2" },
        { title: "neko", rowId: "rowid2" },
        { title: "pokemon", rowId: "rowid2" },
        { title: "rpaper", rowId: "rowid2" },
        { title: "sauce", rowId: "rowid2" },
        { title: "vtuber", rowId: "rowid2" },
        { title: "waifu", rowId: "rowid2" },
        { title: "wallpaper", rowId: "rowid2" },
      ];
      let sections;
      if (!(await (await this.client.getGroupData(M.from)).nsfw)) {
        sections = [
          { title: "Coding", rows: coding },
          { title: "Economy", rows: economy },
          { title: "Educative", rows: educative },
          { title: "Fun", rows: fun },
          { title: "Games", rows: games },
          { title: "General", rows: general },
          { title: "Media", rows: media },
          { title: "Moderation", rows: moderation },
          { title: "Pokemon", rows: pokemon },
          { title: "Utils", rows: utils },
          { title: "Weeb", rows: weeb },
          { title: "Characters", rows: characters },
        ];
      } else {
        sections = [
          { title: "Coding", rows: coding },
          { title: "Economy", rows: economy },
          { title: "Educative", rows: educative },
          { title: "Fun", rows: fun },
          { title: "Games", rows: games },
          { title: "General", rows: general },
          { title: "Media", rows: media },
          { title: "Moderation", rows: moderation },
          { title: "Nsfw", rows: nsfw },
          { title: "Pokemon", rows: pokemon },
          { title: "Utils", rows: utils },
          { title: "Weeb", rows: weeb },
          { title: "Characters", rows: characters },
        ];
      }
      interface button {
        buttonText: string;
        footerText: string;
        description: string;
        sections: string[];
        listType: number;
      }
      const button: any = {
        buttonText: "Command List",
        footerText: "🎇 Beyond 🎇",
        description: `${text} 📝 *Note: Use ${this.client.config.prefix}help <command_name> to view the command info*`,
        sections: sections,
        listType: 1,
      };
      this.client.sendMessage(M.from, button, MessageType.listMessage, {
        quoted: M.WAMessage,
        contextInfo: { mentionedJid: [user] },
      });
    }
    const key = parsedArgs.joined.toLowerCase();
    if (key === "" || key === " ") return void null;
    const command =
      this.handler.commands.get(key) || this.handler.aliases.get(key);
    if (!command) return void null;
    const state = await this.client.DB.disabledcommands.findOne({
      command: command.config.command,
    });
    M.reply(
      `🚀 *Command:* ${this.client.util.capitalize(
        command.config?.command
      )}\n📉 *Status:* ${
        state ? "Disabled" : "Available"
      }\n⛩ *Category:* ${this.client.util.capitalize(
        command.config?.category || ""
      )}${
        command.config.aliases
          ? `\n♦️ *Aliases:* ${command.config.aliases
              .map(this.client.util.capitalize)
              .join(", ")}`
          : ""
      }\n🎐 *Group Only:* ${this.client.util.capitalize(
        JSON.stringify(!command.config.dm ?? true)
      )}\n💎 *Usage:* ${command.config?.usage || ""}\n\n📒 *Description:* ${
        command.config?.description || ""
      }`
    );
  };
}
