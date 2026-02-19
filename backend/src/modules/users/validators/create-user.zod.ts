import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
