const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "!commands",
  description: "lists all commands rhymeBot offers",
  async execute(msg, args) {
    const commandEmbed = new MessageEmbed()
      .setColor("#FF1493")
      .setTitle(
        `
                HERE IS A LIST OF ALL THE COMMANDS I HAVE TO OFFER!
                `
      )
      .addFields(
        { name: "Rhymes", value: `!rhy <word>` },
        { name: "Related Words", value: `!rel <word(s)>` },
        { name: "Synonyms", value: `!syn <word>` },
        {
          name: "Author",
          value: `
            Github: https://github.com/Elijah-Hensel 
            `,
        },
        {
          name: "Credits",
          value: `
            DataMuse API: https://datamuse.com/api
            Merriam-Webster API: https://dictionaryapi.com 
            `,
        }
      );
    msg.reply({ embeds: [commandEmbed] });
  },
};
