import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;
  // check user exist or not
  const user = await User.isUserExistByCustomId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //   // is user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
  }
  //   // is user blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
  }

  const hashPassword = user?.password;
  const isPasswordMatch = await User.isPasswordMatched(password, hashPassword);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched!!!');
  }

  // jwt access token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expire_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { oldPassword, newPassword } = payload;
  // check user exist or not
  const user = await User.isUserExistByCustomId(userData?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //   // is user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
  }
  //   // is user blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
  }

  const hashPassword = user?.password;
  const isPasswordMatch = await User.isPasswordMatched(
    oldPassword,
    hashPassword,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched!!!');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.role,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

// refresh token
const refreshToken = async (token: string) => {
  //check token valid or not

  const decoded = verifyToken(token, config.jwt_refresh_token as string);
  // const decoded = jwt.verify(
  //   token,
  //   config.jwt_refresh_token as string,
  // ) as JwtPayload;
  // check role
  const { userId, iat } = decoded;

  // check user exist or not
  const user = await User.isUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //   // is user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
  }
  //   // is user blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
  }

  // issued password
  if (
    user?.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChange(user?.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!!');
  }

  // jwt access token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expire_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // check user exist or not
  const user = await User.isUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //   // is user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
  }
  //   // is user blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
  }

  // jwt access token
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //   // is user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user is deleted');
  }
  //   // is user blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'user is blocked');
  }

  // const decoded = jwt.verify(
  //   token,
  //   config.jwt_access_token as string,
  // ) as JwtPayload;
  const decoded = verifyToken(token, config.jwt_access_token as string);

  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, ' forbidden request');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: decoded?.userId,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
