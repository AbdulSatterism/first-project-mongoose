import { z } from 'zod';

const authUserValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'old password is required' }),
    newPassword: z.string({ required_error: 'password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'refresh token is required' }),
  }),
});

export const authValidations = {
  authUserValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};