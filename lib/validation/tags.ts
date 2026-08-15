import * as z from "zod";

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required.").max(50, "Tag name is too long."),
});
