const axios = require("axios");
const { MessageEmbed } = require("discord.js");

let rhymes = [];

async function getRhyme(args) {
  try {
    const { data } = await axios.get(
      `https://api.datamuse.com/words?rel_rhy=${args}`
    );

    return data;
  } catch (err) {
    console.error("Could not fetch rhymes");
    throw err;
  }
}

async function mapRhymes(args) {
  if (rhymes.length > 1) {
    rhymes = [];
  }
  try {
    const data = await getRhyme(args);
    if (!data) {
      return;
    }
    data.map((word) => {
      if (rhymes.length < 20) {
        rhymes.push(word.word);
      }
    });
  } catch (err) {
    console.error("could not map rhymes");
    throw err;
  }
}

module.exports = {
  name: "!rhy",
  description: "simple rhyme generator",
  async execute(msg, args) {
    try {
      await mapRhymes(args);

      if (rhymes.length < 1) {
        msg.reply(`Could not retrieve words that rhyme with ${args}`);
        return;
      }

      const rhymeEmbed = new MessageEmbed()
        .setColor("#FF1493")
        .setTitle(
          `
              HERE ARE SOME RHYMES FOR YOU
              `
        )
        .addFields({ name: "Rhymes", value: `${rhymes.join(`\n`)}` });
      msg.reply({ embeds: [rhymeEmbed] });
    } catch (err) {
      console.error("Could not return mapped rhymes");
      throw err;
    }
  },
};
