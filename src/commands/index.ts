import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js"
import coinflip from "./coinflip"
import random from "./random"
import shuffle from "./shuffle"

export default [random, coinflip, shuffle] satisfies Command[]

export type Command = {
	config: Partial<SlashCommandBuilder>
	execute: (int: ChatInputCommandInteraction) => void
}
