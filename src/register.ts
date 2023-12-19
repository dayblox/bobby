import { REST, Routes } from "discord.js"
import { Commands } from "./commands"

export default async (commands: Commands) => {
	try {
		await new REST()
			.setToken(Bun.env.TOKEN!)
			.put(Routes.applicationCommands(Bun.env.CLIENT_ID!), {
				body: commands,
			})
	} catch (error) {
		console.error(error)
	}
}
