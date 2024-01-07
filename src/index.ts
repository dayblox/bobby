import { Client } from "discord.js"
import commands from "./commands"
import log from "./utils/log"
import register from "./utils/register"

register(commands.map(({ config }) => config))

new Client({ intents: [] })
	.on("interactionCreate", (interaction) => {
		if (!interaction.isChatInputCommand()) return
		commands
			.find(({ config: { name } }) => name === interaction.commandName)
			?.execute(interaction)
		log(interaction)
	})
	.login(Bun.env.TOKEN)
