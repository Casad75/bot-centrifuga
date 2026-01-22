require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once("ready", () => {
  console.log("🌀 Bot centrifuga ONLINE");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "centrifuga") {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({ content: "Entra prima in un canale vocale 😤", ephemeral: true });
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    const playLoop = () => {
      const resource = createAudioResource("./centrifuga.mp3");
      player.play(resource);
    };

    playLoop();

    player.on(AudioPlayerStatus.Idle, playLoop);

    connection.subscribe(player);
    interaction.reply("🌀 **CENTRIFUGA AVVIATA** 🌀");
  }
});

client.login(process.env.TOKEN);
