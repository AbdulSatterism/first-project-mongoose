import { z } from 'zod';

const userSchemaValidation = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .max(20, { message: 'password can not be more than 20 char' })
    .optional(),
});

export default userSchemaValidation;
