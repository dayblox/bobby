import { Client, GatewayIntentBits } from "discord.js"
import commands from "./commands"
import log from "./log"
import register from "./register"

register(commands.map(({ data }) => data))

new Client({ intents: [GatewayIntentBits.Guilds] })
	.on("interactionCreate", (interaction) => {
		if (interaction.isChatInputCommand())
			commands
				.find(({ data: { name } }) => name === interaction.commandName)
				?.execute(interaction) && log(interaction)
	})
	.login(Bun.env.TOKEN)
