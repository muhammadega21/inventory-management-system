import { ZodError } from "zod";

// mengubah value menjadi integer positif, jika tidak valid maka akan menggunakan fallback dan membatasi maksimalnya
export const formatZodErrors = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "root";

    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
};
