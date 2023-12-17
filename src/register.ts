import { REST, Routes } from "discord.js"
import { Commands } from "./commands"

const rest = new REST({ version: "10" }).setToken(Bun.env.TOKEN!)

export default async (commands: Commands) => {
	try {
		await rest.put(Routes.applicationCommands(Bun.env.CLIENT_ID!), {
			body: commands,
		})
	} catch (error) {
		console.error(error)
	}
}
