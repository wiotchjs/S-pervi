const { Client, Collection, Intents } = require("discord.js");
const client = global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});
const dotenv = require("dotenv");
dotenv.config();
const { readdir } = require("fs");
require("moment-duration-format");
const config = require("./config");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
client.cooldown = new Map();
client.commandblocked = [];

require("./src/helpers/function")(client);

readdir("./src/commands/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./src/commands/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let prop = require(`./src/commands/${f}/` + file);
        console.log(`[BORANGKDN-COMMAND] ${prop.name} yüklendi!`);
        commands.set(prop.name, prop);
        prop.aliases.forEach(alias => {
          aliases.set(alias, prop.name);
        });
      });
    });
  });
});

readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let prop = require(`./src/events/${file}`);
    if (!prop.conf) return;
    client.on(prop.conf.name, prop);
    console.log(`[BORANGKDN-EVENT] ${prop.conf.name} yüklendi!`);
  });
});

client.login("ODA3NjU3OTQxODA4ODQwNzU0.YB7MEg.M3HzTOCLKowKq_N6dhNfIBeZ4OQ")
  .then(() => console.log(`Bot ${client.user.username} olarak giriş yaptı!`))
  .catch((err) => console.log(`Bot Giriş yapamadı sebep: ${err}`));

  client.on("interactionCreate",async (interaction, message) => {

    if(interaction.isButton()) {

      if(interaction.customId === "etkinlik") {
        let member = interaction.member
        if(member.roles.cache.has(config.buttons.activity)) {
          await member.roles.remove(config.buttons.activity);
          await interaction.reply({ content: `<@&${config.buttons.activity}> rolü başarıyla üzerinizden alındı!`, ephemeral: true });
        } else {
          await member.roles.add(config.buttons.activity);
          await interaction.reply({ content: `<@&${config.buttons.activity}> rolü başarıyla üzerinize eklendi!`, ephemeral: true });
        };
      };
      
      
      if(interaction.customId === "cekilis") {
        let member = interaction.member
        if(member.roles.cache.has(config.buttons.giveaway)) {
          await member.roles.remove(config.buttons.giveaway);
          await interaction.reply({ content: `<@&${config.buttons.giveaway}> rolü başarıyla üzerinizden alındı!`, ephemeral: true });
        } else {
          await member.roles.add(config.buttons.giveaway);
          await interaction.reply({ content: `<@&${config.buttons.giveaway}> rolü başarıyla üzerinize eklendi!`, ephemeral: true });
        };
      };

    }})