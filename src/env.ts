import { z } from "zod"

export const { TOKEN, CLIENT_ID } = z
	.object({
		TOKEN: z.string(),
		CLIENT_ID: z.string(),
	})
	.parse(Bun.env)
