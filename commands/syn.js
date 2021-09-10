//str.split(' ').join('+');
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

let words = [];

function hasWhiteSpace(s) {
  return s.indexOf(" ") >= 0;
}

async function getWords(args) {
  if (hasWhiteSpace(args)) {
    return false;
  }
  try {
    const { data } = await axios.get(
      `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${args}?key=${process.env.THES_KEY}`
    );
    if (data[0].meta) {
      console.log(data[0].meta.syns[0]);
      return data[0].meta.syns[0];
    }
    return;
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
        words.push(word);
      }
    });
  } catch (err) {
    console.error("could not map words");
    throw err;
  }
}

module.exports = {
  name: "!syn",
  description: "words related to input definition generator",
  async execute(msg, args) {
    let upperCaseArgs = args.join(" ");

    try {
      await mapWords(args);
      console.log(words, "words");

      if (hasWhiteSpace(args)) {
        msg.reply(`Please enter one word without spaces`);
        return;
      }

      if (words.length < 1) {
        msg.reply(`Could not retrieve words that are related to ${args}`);
        return;
      }

      const wordEmbed = new MessageEmbed()
        .setColor("#FF1493")
        .setTitle(
          `
                HERE ARE SOME SYNONYMS OF ${upperCaseArgs} FOR YOU
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
