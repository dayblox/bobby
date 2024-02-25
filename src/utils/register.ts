import { REST, Routes } from "discord.js"
import type { Command } from "../commands"

export default async (body: Command["config"][]) => {
  try {
    await new REST()
      .setToken(Bun.env.TOKEN!)
      .put(Routes.applicationCommands(Bun.env.CLIENT_ID!), { body })
  } catch (error) {
    console.error(error)
  }
}
