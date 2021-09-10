//str.split(' ').join('+');
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

let words = [];
let combinedString;

function hasWhiteSpace(s) {
  return s.indexOf(" ") >= 0;
}

function replaceWhiteSpaceWithPlus(str) {
  return str.replace(/\s/g, "+");
}

async function getWords(args) {
  console.log(args);
  let arg = args;
  if (hasWhiteSpace(args)) {
    combinedString = replaceWhiteSpaceWithPlus(args);
    arg = combinedString;
  }

  try {
    const { data } = await axios.get(
      `https://api.datamuse.com/words?ml=${arg}`
    );

    return data;
  } catch (err) {
    console.error(`Could not fetch words related to ${args}`);
    throw err;
  }
}

async function mapWords(args) {
  if (words.length > 1) {
    words = [];
  }
  try {
    const data = await getWords(args);
    if (!data) {
      return;
    }
    data.map((word) => {
      if (words.length < 20) {
        words.push(word.word);
      }
    });
  } catch (err) {
    console.error("could not map words");
    throw err;
  }
}

module.exports = {
  name: "!related",
  description: "words related to input definition generator",
  async execute(msg, args) {
    try {
      await mapWords(args);

      if (words.length < 1) {
        msg.reply(`Could not retrieve words that are related to ${args}`);
        return;
      }
      console.log(args, "LAST LOG");
      const wordEmbed = new MessageEmbed()
        .setColor("#FF1493")
        .setTitle(
          `
              HERE ARE SOME WORDS RELATED TO ${args.join(" ")} FOR YOU
              `
        )
        .addFields({ name: "Words", value: `${words.join(`\n`)}` });
      msg.reply({ embeds: [wordEmbed] });
    } catch (err) {
      console.error("Could not return mapped words");
      throw err;
    }
  },
};
