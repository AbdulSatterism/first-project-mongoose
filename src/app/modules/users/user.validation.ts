import { z } from 'zod';
import { UserStatus } from './user.const';

const userSchemaValidation = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .max(20, { message: 'password can not be more than 20 char' })
    .optional(),
});

const statusChangeSchemaValidation = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  userSchemaValidation,
  statusChangeSchemaValidation,
};
