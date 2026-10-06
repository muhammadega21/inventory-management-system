import z from "zod";

export const idParamSchema = z.object({
  id: z.coerce
    .number({
      error: () => "ID must be a number",
    })
    .int("ID must be an integer")
    .positive("ID must be a positive number"),
});
