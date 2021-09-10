require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    // Intents.FLAGS.GUILD_MEMBERS,
  ],
});
bot.commands = new Collection();
const botCommands = require("./commands");
const TOKEN = process.env.TOKEN;

Object.keys(botCommands).map((key) => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  // var channel = bot.channels.get('832783478269411360');
  // channel.sendMessage("**Hello! I am the Rhyme-Bottapatamous and my rhymes-schemes are bottomless**\n```To use my magical rhymetastical abilities, insert with ease a word if you'd please \n !rhyme <word>```");
});

bot.on("message", (msg) => {
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
});
