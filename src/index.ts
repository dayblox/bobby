import { Client, GatewayIntentBits } from "discord.js"
import commands from "./commands"
import register from "./register"

register(commands.map(({ data }) => data))

new Client({ intents: [GatewayIntentBits.Guilds] })
	.on("interactionCreate", (interaction) => {
		if (!interaction.isChatInputCommand()) return
		console.log(
			JSON.stringify({
				command: interaction.commandName,
				options: interaction.options.data[0].options?.map(
					({ name, value, user }) => ({
						name,
						value: user?.displayName ?? value,
					}),
				),
				author: interaction.user.displayName,
			}),
		)
		commands
			.find(({ data: { name } }) => name === interaction.commandName)
			?.execute(interaction)
	})
	.login(Bun.env.TOKEN)
