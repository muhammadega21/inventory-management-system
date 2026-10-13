import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;
