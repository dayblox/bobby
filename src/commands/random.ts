import { AsciiTable3 } from "ascii-table3"
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js"

const maxUsers = Number(Bun.env.MAX_USERS)

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
				sub.setName("user").setDescription("Select one user randomly"),
			),
		)
		.addSubcommand((sub) =>
			withUserOptions(
				sub
					.setName("users")
					.setDescription("Select multiple users randomly")
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
					.setDescription("Form groups randomly")
					.addIntegerOption((option) =>
						option
							.setName("group_size")
							.setDescription("How many users per group")
							.setRequired(true),
					),
			),
		)
		.addSubcommand((sub) =>
			sub
				.setName("number")
				.setDescription("Pick a random number")
				.addIntegerOption((option) =>
					option
						.setName("min")
						.setDescription("Minimum value (included)")
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName("max")
						.setDescription("Maximum value (included)")
						.setRequired(true),
				),
		),
	async execute(int: ChatInputCommandInteraction) {
		const users = []
		for (let i = 1; i <= maxUsers; i++) {
			const user = int.options.getUser(`user_${i}`)
			if (user) users.push(user)
		}

		switch (int.options.getSubcommand()) {
			case "user":
				return await int.reply(
					`${users[Math.floor(Math.random() * users.length)]}`,
				)
			case "users": {
				const quantity = int.options.getInteger("quantity")!
				if (quantity > users.length)
					return await int.reply(
						`Cannot select ${quantity} users from only ${users.length} users.`,
					)
				const selected = []
				for (let i = 0; i < quantity; i++)
					selected.push(
						users.splice(Math.floor(Math.random() * users.length), 1)[0],
					)
				return await int.reply(selected.join(" "))
			}
			case "groups": {
				const groupSize = int.options.getInteger("group_size")!
				const groups = Array.from(Array(groupSize), () =>
					Array(Math.ceil(users.length / groupSize)).fill(""),
				)
				for (let i = 0; users.length; i++)
					groups[i % groupSize][Math.floor(i / groupSize)] = users.splice(
						Math.floor(Math.random() * users.length),
						1,
					)[0].displayName

				return await int.reply(
					`\`\`\`${new AsciiTable3("Random groups")
						.addRowMatrix(groups)
						.setStyle("unicode-single")}\`\`\``,
				)
			}
			case "number":
				return await int.reply(
					Math.floor(
						Math.random() *
							(int.options.getInteger("max")! -
								int.options.getInteger("min")! +
								1) +
							int.options.getInteger("min")!,
					).toString(),
				)
		}
	},
}
