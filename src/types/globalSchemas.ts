import { z } from "zod";

export const defaultResponse = z.object({
	message: z.string(),
});
