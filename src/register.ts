import { REST, Routes, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import { CLIENT_ID, TOKEN } from "./env"

const rest = new REST({ version: "10" }).setToken(TOKEN)

export default async (commands: SlashCommandSubcommandsOnlyBuilder[]) => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
	} catch (error) {
		console.error(error)
	}
}
