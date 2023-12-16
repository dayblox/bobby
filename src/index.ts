import { Client, GatewayIntentBits } from "discord.js"
import commands from "./commands"
import { TOKEN } from "./env"
import register from "./register"

register(commands.map(({ data }) => data))

new Client({ intents: [GatewayIntentBits.Guilds] })
	.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return
		commands
			.find(({ data: { name } }) => name === interaction.commandName)
			?.execute(interaction)
	})
	.login(TOKEN)
