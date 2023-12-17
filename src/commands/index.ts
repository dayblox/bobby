import coinflip from "./coinflip"
import random from "./random"
import shuffle from "./shuffle"

const commands = [random, coinflip, shuffle]

export default commands
export type Commands = (typeof commands)[number]["data"][]
