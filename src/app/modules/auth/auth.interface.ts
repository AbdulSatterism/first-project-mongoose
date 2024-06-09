import { USER_ROLE } from './auth.const';

export type TLoginUser = {
  id: string;
  password: string;
};

export type TUserRole = keyof typeof USER_ROLE;
