import { ChatInputCommandInteraction } from "discord.js"

export default (interaction: ChatInputCommandInteraction) => {
	let msg = interaction.commandName
	try {
		msg += ` ${interaction.options.getSubcommand()}`
	} catch {}
	console.log(
		JSON.stringify({
			msg,
			options: interaction.options.data[0]?.options?.reduce(
				(acc, { name, value, user }) => {
					acc[name] = user?.displayName ?? value
					return acc
				},
				{} as Record<string, string | number | boolean | undefined>,
			),
			author: interaction.user.displayName,
		}),
	)
}
