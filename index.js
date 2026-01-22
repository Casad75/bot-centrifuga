require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log("🌀 Bot centrifuga ONLINE");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "centrifuga") {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        content: "Entra prima in un canale vocale 😤",
        ephemeral: true,
      });
    }

    // Entra nel canale vocale senza essere mutato o deaf
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    // Aspetta che la connessione sia pronta
    connection.on("stateChange", (oldState, newState) => {
      if (newState.status === "ready") {
        const player = createAudioPlayer();

        const playLoop = () => {
          const resource = createAudioResource("./centrifuga.mp3");
          player.play(resource);
        };

        // Avvia subito l'audio
        playLoop();

        // Loop infinito
        player.on(AudioPlayerStatus.Idle, playLoop);

        // Collega player alla connessione
        connection.subscribe(player);
      }
    });

    interaction.reply("🌀 **CENTRIFUGA AVVIATA** 🌀");
  }
});

client.login(process.env.TOKEN);
