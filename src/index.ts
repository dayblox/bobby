import { Client } from "discord.js"
import commands from "./commands"
import log from "./utils/log"
import register from "./utils/register"

register(Object.values(commands).map(({ config }) => config))

new Client({ intents: [] })
  .on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return
    commands[interaction.commandName].execute(interaction)
    log(interaction)
  })
  .on("ready", () => console.log("Connected"))
  .login(Bun.env.TOKEN)
