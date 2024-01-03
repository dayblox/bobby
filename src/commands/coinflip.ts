import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export default {
	config: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Flip a coin"),
	execute(int: ChatInputCommandInteraction) {
		int.reply(Math.random() < 0.5 ? "🪙 Heads" : "🪙 Tails")
	},
}
