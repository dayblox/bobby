import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export default {
	config: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffle words randomly")
		.addStringOption((option) =>
			option
				.setName("words")
				.setDescription("Words to shuffle")
				.setRequired(true),
		),
	execute(int: ChatInputCommandInteraction) {
		const words = int.options.getString("words")!.split(/[ ,;_/-]+/)
		for (let i = words.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const temp = words[i]
			words[i] = words[j]
			words[j] = temp
		}
		int.reply(words.join(" "))
	},
}
