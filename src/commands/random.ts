import { AsciiTable3 } from "ascii-table3"
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js"

const maxUsers = 10

const withUserOptions = (builder: SlashCommandSubcommandBuilder) => {
	for (let i = 1; i <= maxUsers; i++) {
		builder.addUserOption((option) =>
			option
				.setName(`user_${i}`)
				.setDescription("User")
				.setRequired(i <= 2),
		)
	}
	return builder
}

export default {
	data: new SlashCommandBuilder()
		.setName("random")
		.setDescription("random")
		.addSubcommand((sub) =>
			withUserOptions(
				sub.setName("user").setDescription("Randomly select one user"),
			),
		)
		.addSubcommand((sub) =>
			withUserOptions(
				sub
					.setName("users")
					.setDescription("Randomly select multiple users")
					.addIntegerOption((option) =>
						option
							.setName("quantity")
							.setDescription("How many users to select")
							.setRequired(true)
							.setMinValue(1)
							.setMaxValue(maxUsers - 1),
					),
			),
		)
		.addSubcommand((sub) =>
			withUserOptions(
				sub
					.setName("groups")
					.setDescription("Randomly form groups")
					.addIntegerOption((option) =>
						option
							.setName("group_size")
							.setDescription("How many users per group")
							.setRequired(true),
					),
			),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const users = []
		for (let i = 1; i <= maxUsers; i++) {
			const user = interaction.options.getUser(`user_${i}`)
			if (user) users.push(user)
		}

		switch (interaction.options.getSubcommand()) {
			case "user":
				return await interaction.reply(
					`${users[Math.floor(Math.random() * users.length)]}`,
				)
			case "users": {
				const quantity = interaction.options.getInteger("quantity")!
				if (quantity > users.length)
					return await interaction.reply(
						`Cannot select ${quantity} users from only ${users.length} users.`,
					)
				const selected = []
				for (let i = 0; i < quantity; i++)
					selected.push(
						users.splice(Math.floor(Math.random() * users.length), 1)[0],
					)
				return await interaction.reply(selected.join(" "))
			}
			case "groups": {
				const groupSize = interaction.options.getInteger("group_size")!
				const groups = Array.from(Array(groupSize), () =>
					Array(Math.ceil(users.length / groupSize)).fill(""),
				)
				for (let i = 0; users.length; i++)
					groups[i % groupSize][Math.floor(i / groupSize)] = users.splice(
						Math.floor(Math.random() * users.length),
						1,
					)[0].displayName

				return await interaction.reply(
					`\`\`\`${new AsciiTable3("Random groups")
						.addRowMatrix(groups)
						.setStyle("unicode-single")}\`\`\``,
				)
			}
		}
	},
}
