import { REST, Routes } from "discord.js"
import commands from "../commands"

export default async (body: (typeof commands)[0]["config"][]) => {
	try {
		await new REST()
			.setToken(Bun.env.TOKEN!)
			.put(Routes.applicationCommands(Bun.env.CLIENT_ID!), { body })
	} catch (error) {
		console.error(error)
	}
}
