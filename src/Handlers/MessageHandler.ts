import axios from "axios";
import chalk from "chalk";
import { join } from "path";
import BaseCommand from "../lib/BaseCommand";
import WAClient from "../lib/WAClient";
import { ICommand, IParsedArgs, ISimplifiedMessage } from "../typings";
import { MessageType } from "@adiwajshing/baileys";
import cron from "node-cron";
import marika from "@shineiichijo/marika";

export default class MessageHandler {
  commands = new Map<string, ICommand>();
  aliases = new Map<string, ICommand>();
  constructor(public client: WAClient) {}

  handleMessage = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.WAMessage?.message?.buttonsResponseMessage) {
      const res: any =
        M.WAMessage?.message?.buttonsResponseMessage.selectedButtonId;
      const command = this.commands.get(res);
      const { args, groupMetadata, sender } = M;
      if (
        (await this.client.getGroupData(M.from)).bot !== this.client.user.name
      )
        return void null;
      command?.run(M, this.parseArgs(args));
    }
    if (M.WAMessage?.message?.listResponseMessage) {
      const key: any = M.WAMessage?.message?.listResponseMessage.title;
      const comm = this.commands.get(key) || this.aliases.get(key);
      console.log(comm?.config);
      const state = await this.client.DB.disabledcommands.findOne({
        command: comm?.config.command,
      });
      if (
        comm?.config?.command === undefined ||
        (await this.client.getGroupData(M.from)).bot !== this.client.user.name
      )
        return void null;
      M.reply(
        `🚀 *Command:* ${this.client.util.capitalize(
          comm?.config?.command
        )}\n📈 *Status:* ${state ? "Disabled" : "Available"}
            \n⛩ *Category:* ${this.client.util.capitalize(
              comm?.config?.category || ""
            )}${
          comm?.config.aliases && comm?.config.command !== "react"
            ? `\n♦️ *Aliases:* ${comm?.config.aliases
                .map(this.client.util.capitalize)
                .join(", ")}`
            : ""
        }\n🎐 *Group Only:* ${this.client.util.capitalize(
          JSON.stringify(!comm?.config.dm ?? true)
        )}\n💎 *Usage:* ${comm?.config?.usage || ""}\n\n📒 *Description:* ${
          comm?.config?.description || ""
        }`
      );
    }
    if (
      !(M.chat === "dm") &&
      M.WAMessage.key.fromMe &&
      M.WAMessage.status.toString() === "2"
    ) {
      /*
            BUG : It receives message 2 times and processes it twice.
            https://github.com/adiwajshing/Baileys/blob/8ce486d/WAMessage/WAMessage.d.ts#L18529
            https://adiwajshing.github.io/Baileys/enums/proto.webmessageinfo.webmessageinfostatus.html#server_ack
            */
      M.sender.jid = this.client.user.jid;
      M.sender.username =
        this.client.user.name ||
        this.client.user.vname ||
        this.client.user.short ||
        "Chitoge";
    } else if (M.WAMessage.key.fromMe) return void null;

    if (M.from.includes("status")) return void null;
    const { args, groupMetadata, sender } = M;
    if (M.chat === "dm" && this.client.isFeature("chatbot")) {
      if (this.client.config.chatBotUrl) {
        const myUrl = new URL(this.client.config.chatBotUrl);
        const params = myUrl.searchParams;
        await axios
          .get(
            `${encodeURI(
              `http://api.brainshop.ai/get?bid=${params.get(
                "bid"
              )}&key=${params.get("key")}&uid=${M.sender.jid}&msg=${M.args}`
            )}`
          )
          .then((res) => {
            if (res.status !== 200)
              return void M.reply(`🔍 Error: ${res.status}`);
            return void M.reply(res.data.cnt);
          })
          .catch(() => {
            M.reply(`Well...`);
          });
      }
    }
    if (!M.groupMetadata && !(M.chat === "dm")) return void null;

    if (
      (await this.client.getGroupData(M.from)).mod &&
      M.groupMetadata?.admins?.includes(this.client.user.jid)
    )
      this.moderate(M);
    if (!args[0] || !args[0].startsWith(this.client.config.prefix))
      return void this.client.log(
        `${chalk.blueBright("MSG")} from ${chalk.green(
          sender.username
        )} in ${chalk.cyanBright(groupMetadata?.subject || "")}`
      );
    const cmd = args[0].slice(this.client.config.prefix.length).toLowerCase();
    // If the group is set to muted, don't do anything
    const allowedCommands = ["activate", "deactivate", "act", "deact"];
    if (
      !(
        allowedCommands.includes(cmd) ||
        (await this.client.getGroupData(M.from)).cmd
      )
    )
      return void this.client.log(
        `${chalk.green("CMD")} ${chalk.yellow(
          `${args[0]}[${args.length - 1}]`
        )} from ${chalk.green(sender.username)} in ${chalk.cyanBright(
          groupMetadata?.subject || "DM"
        )}`
      );
    const bot = await (await this.client.getGroupData(M.from)).bot;
    const command = this.commands.get(cmd) || this.aliases.get(cmd);
    const reservedCommands = ["switch", "hi"];
    this.client.log(
      `${chalk.green("CMD")} ${chalk.yellow(
        `${args[0]}[${args.length - 1}]`
      )} from ${chalk.green(sender.username)} in ${chalk.cyanBright(
        groupMetadata?.subject || "DM"
      )}`
    );
    if (
      bot !== this.client.user.name &&
      !reservedCommands.includes(cmd) &&
      bot !== "all" &&
      M.chat !== "dm"
    )
      return void null;
    if (!command)
      return void M.reply(
        `🍁𝑨𝒉𝒉 𝒔𝒉𝒊𝒕 𝒎𝒂𝒏 𝒚𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒌𝒏𝒐𝒘 𝒉𝒐𝒘 𝒕𝒐 𝒕𝒚𝒑𝒆 *${this.client.config.prefix}help* 𝒘𝒆𝒍𝒍 𝒇𝒊𝒏𝒆 𝒊𝒏 𝒕𝒉𝒂𝒕 𝒄𝒂𝒔𝒆 𝒚𝒐𝒖 𝒘𝒊𝒍𝒍 𝒅𝒊𝒆 𝒉𝒆𝒓𝒆.`
      );
    const user = await this.client.getUser(M.sender.jid);
    if (user.ban) return void M.reply("𝕐𝕠𝕦'𝕣𝕖 𝕓𝕒𝕟𝕟𝕖𝕕 𝕗𝕣𝕠𝕞 𝕌𝕤𝕚𝕟𝕘 𝕥𝕙𝕖 𝕔𝕠𝕞𝕞𝕒𝕟𝕕𝕤.");
    const state = await this.client.DB.disabledcommands.findOne({
      command: command.config.command,
    });
    if (state)
      return void M.reply(
        `✖ 𝐁𝐚𝐤𝐚! 𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐢𝐬 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝${
          state.reason ? ` for ${state.reason}` : ""
        }`
      );
    if (!command.config?.dm && M.chat === "dm")
      return void M.reply("Commands cannot be used in direct messages *Send a message/text without a prefix to have a chat*");
    if (
      command.config?.modsOnly &&
      !this.client.config.mods?.includes(M.sender.jid)
    ) {
      return void M.reply(`𝐨𝐧𝐥𝐲 𝐛𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 𝐩𝐞𝐨𝐩𝐥𝐞 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝..`);
    }
    if (command.config?.adminOnly && !M.sender.isAdmin)
      return void M.reply(
        `𝙆𝙣𝙤𝙬 𝙔𝙤𝙪𝙧 𝙋𝙡𝙖𝙘𝙚 𝙛𝙤𝙤𝙡 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙞𝙨 𝙤𝙣𝙡𝙮 𝙢𝙚𝙖𝙣𝙩 𝙛𝙤𝙧 𝙩𝙝𝙚 𝙜𝙧𝙤𝙪𝙥 𝙖𝙙𝙢𝙞𝙣𝙨, 𝘽𝙖𝙠𝙖!`
      );
    try {
      await command.run(M, this.parseArgs(args));
      if (command.config.baseXp) {
        await this.client.setXp(M.sender.jid, command.config.baseXp || 10, 50);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return void this.client.log(err.message, true);
    }
  };

  moderate = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.sender.isAdmin) return void null;
    if (M.urls.length) {
      const groupinvites = M.urls.filter((url) =>
        url.includes("chat.whatsapp.com")
      );
      if (groupinvites.length) {
        groupinvites.forEach(async (invite) => {
          const splitInvite = invite.split("/");
          const z = await this.client.groupInviteCode(M.from);
          if (z !== splitInvite[splitInvite.length - 1]) {
            this.client.log(
              `${chalk.blueBright("MOD")} ${chalk.green(
                "Group Invite"
              )} by ${chalk.yellow(M.sender.username)} in ${
                M.groupMetadata?.subject || ""
              }`
            );
            return void (await this.client.groupRemove(M.from, [M.sender.jid]));
          }
        });
      }
    }
  };

  spawnPokemon = async (): Promise<void> => {
    cron.schedule("*/2 * * * *", async () => {
      const Data = await await this.client.getFeatures("pokemon");
      if (Data.id === "000") return void null;
      const p = Math.floor(Math.random() * Data.jids.length);
      const q = await this.client.getGroupData(Data.jids[p]);
      if (!q.wild || q.bot !== this.client.user.name) return void null;
      const i = Math.floor(Math.random() * 898);
      const y = Math.floor(Math.random() * 100);
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      const buffer = await this.client.getBuffer(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
      );
      await this.client.DB.group.updateMany(
        { jid: Data.jids[p] },
        {
          $set: {
            catchable: true,
            lastPokemon: data.name,
            pId: data.id,
            pLevel: y,
            pImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          },
        }
      );
      await this.client.sendMessage(Data.jids[p], buffer, MessageType.image, {
        caption: `A wild pokemon appeared! Use ${this.client.config.prefix}catch  <pokemon name> to catch this pokemon.`,
      });
      setTimeout(async () => {
        await this.client.DB.group.updateOne(
          { jid: Data.jids[p] },
          { $set: { catchable: false } }
        );
      }, 500000);
    });
  };

  summonChara = async (): Promise<void> => {
    cron.schedule("*/3 * * * *", async () => {
      const data = await this.client.getFeatures("chara");
      const p = Math.floor(Math.random() * data.jids.length);
      const q = await this.client.getGroupData(data.jids[p]);
      if (!q.chara || q.bot !== this.client.user.name) return void null;
      const chara = await marika.getRandomCharacter();
      const i = await this.client.getBuffer(chara.images.jpg.image_url);
      const source = await marika.getCharacterAnime(chara.mal_id);
      const price = Math.floor(Math.random() * (50000 - 25000) + 25000);
      await this.client.DB.group.updateMany(
        { jid: data.jids[p] },
        {
          $set: {
            "charaResponse.id": chara.mal_id,
            "charaResponse.name": chara.name,
            "charaResponse.image": chara.images.jpg.image_url,
            "charaResponse.about": chara.about,
            "charaResponse.source": source[0].anime.title,
            "charaResponse.claimable": true,
            "charaResponse.price": price,
          },
        }
      );
      const media = await this.client.prepareMessage(
        data.jids[p],
        i,
        MessageType.image
      );
      const buttons = [
        {
          buttonId: "claim",
          buttonText: { displayText: `${this.client.config.prefix}claim` },
          type: 1,
        },
      ];
      const buttonMessage: any = {
        contentText: `*A claimable character Appeared!*\n\n🎀 *Name: ${chara.name}*\n\n💬 *About:* ${chara.about}\n\n📛 *Source: ${source[0].anime.title}*\n\n💰 *Price: ${price}*\n\n*[Use ${this.client.config.prefix}claim to have this character in your gallery]*`,
        footerText: "💙 𝔼𝕝𝕒𝕚𝕟𝕒 💙",
        buttons: buttons,
        headerType: 4,
        imageMessage: media?.message?.imageMessage,
      };
      await this.client.sendMessage(
        data.jids[p],
        buttonMessage,
        MessageType.buttonsMessage
      );
      setTimeout(async () => {
        await this.client.DB.group.updateOne(
          { jid: data.jids[p] },
          { $set: { "charaResponse.claimable": false } }
        );
      }, 120000);
    });
  };

  handleState = async (): Promise<void> => {
    const text = `𝙍𝙚𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙🚀 (Elaina👾)Prefix #`;
    await this.client.sendMessage(
      "263716564623-1628429288@g.us",
      text,
      MessageType.text
    );
  };

  sendReconnectMessage = async (): Promise<void> => {
    const text = `I'm back, Darling !! 💖w💖`;
    await this.client.sendMessage(
      "263716564623-1628429288@g.us",
      text,
      MessageType.text
    );
  };

  loadCommands = (): void => {
    this.client.log(chalk.green("Loading Commands..."));
    const path = join(__dirname, "..", "commands");
    const files = this.client.util.readdirRecursive(path);
    files.map((file) => {
      const filename = file.split("/");
      if (!filename[filename.length - 1].startsWith("_")) {
        //eslint-disable-next-line @typescript-eslint/no-var-requires
        const command: BaseCommand = new (require(file).default)(
          this.client,
          this
        );
        this.commands.set(command.config.command, command);
        if (command.config.aliases)
          command.config.aliases.forEach((alias) =>
            this.aliases.set(alias, command)
          );
        this.client.log(
          `Loaded: ${chalk.green(command.config.command)} from ${chalk.green(
            file
          )}`
        );
        return command;
      }
    });
    this.client.log(
      `Successfully Loaded ${chalk.greenBright(this.commands.size)} Commands`
    );
  };

  loadFeatures = (): void => {
    this.client.log(chalk.green("Loading Features..."));
    this.client.setFeatures().then(() => {
      this.client.log(
        `Successfully Loaded ${chalk.greenBright(
          this.client.features.size
        )} Features`
      );
    });
  };

  parseArgs = (args: string[]): IParsedArgs => {
    const slicedArgs = args.slice(1);
    return {
      args: slicedArgs,
      flags: slicedArgs.filter((arg) => arg.startsWith("--")),
      joined: slicedArgs.join(" ").trim(),
    };
  };
}
