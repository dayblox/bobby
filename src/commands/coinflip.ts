import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export default {
	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Flip a coin"),
	async execute(int: ChatInputCommandInteraction) {
		int.reply(Math.random() < 0.5 ? "Heads" : "Tails")
	},
}
