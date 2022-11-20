import { z } from "zod";

export const defaultResponse = z.object({
	message: z.string(),
});

export const errorResponse = defaultResponse.extend({
	errorCode: z.string().optional(),
});
