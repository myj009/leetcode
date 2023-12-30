import z from "zod";

export const submissionSchema = z.object({
  code: z.string().min(1),
  lang: z.enum(["cpp", "java", "javascript", "go"]),
});
