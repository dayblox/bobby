import { AsciiTable3 } from "ascii-table3"
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js"
import type { Command } from "."

const maxUsers = Number(Bun.env.MAX_USERS)

export default {
  config: new SlashCommandBuilder()
    .setName("random")
    .setDescription("random")
    .addSubcommand((sub) =>
      withNameOptions(
        withUserOptions(
          sub.setName("user").setDescription("Select one user randomly"),
        ),
      ),
    )
    .addSubcommand((sub) =>
      withNameOptions(
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
                .setMaxValue(2 * maxUsers - 1),
            ),
        ),
      ),
    )
    .addSubcommand((sub) =>
      withNameOptions(
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
  execute(int: ChatInputCommandInteraction) {
    const users = []
    for (let i = 1; i <= maxUsers; i++) {
      const user = int.options.getUser(`user_${i}`)
      const name = int.options.getString(`name_${i}`)
      if (user) users.push(user)
      if (name) users.push(name)
    }

    switch (int.options.getSubcommand()) {
      case "user":
        return int.reply(`${users[Math.floor(Math.random() * users.length)]}`)
      case "users": {
        const quantity = int.options.getInteger("quantity")!
        if (quantity > users.length)
          return int.reply(
            `Cannot select ${quantity} users from a list of only ${users.length}.`,
          )
        const selected = []
        for (let i = 0; i < quantity; i++)
          selected.push(
            users.splice(Math.floor(Math.random() * users.length), 1)[0],
          )
        return int.reply(selected.join(" "))
      }
      case "groups": {
        const groupSize = int.options.getInteger("group_size")!
        const groups = Array.from(Array(groupSize), () =>
          Array(Math.ceil(users.length / groupSize)).fill(""),
        )
        for (let i = 0; users.length; i++) {
          const user = users.splice(
            Math.floor(Math.random() * users.length),
            1,
          )[0]
          groups[i % groupSize][Math.floor(i / groupSize)] =
            typeof user === "string" ? user : user.displayName
        }

        return int.reply(
          `\`\`\`${new AsciiTable3("Random groups")
            .addRowMatrix(groups)
            .setStyle("unicode-single")}\`\`\``,
        )
      }
      case "number":
        return int.reply(
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
} satisfies Command

function withUserOptions(builder: SlashCommandSubcommandBuilder) {
  for (let i = 1; i <= maxUsers; i++) {
    builder.addUserOption((option) =>
      option
        .setName(`user_${i}`)
        .setDescription("User")
        .setRequired(i === 1),
    )
  }
  return builder
}

function withNameOptions(builder: SlashCommandSubcommandBuilder) {
  for (let i = 1; i <= maxUsers; i++) {
    builder.addStringOption((option) =>
      option.setName(`name_${i}`).setDescription("Name"),
    )
  }
  return builder
}
