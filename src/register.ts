import { REST, Routes, SlashCommandSubcommandsOnlyBuilder } from "discord.js"

const rest = new REST({ version: "10" }).setToken(Bun.env.TOKEN!)

export default async (commands: SlashCommandSubcommandsOnlyBuilder[]) => {
	try {
		await rest.put(Routes.applicationCommands(Bun.env.CLIENT_ID!), {
			body: commands,
		})
	} catch (error) {
		console.error(error)
	}
}
