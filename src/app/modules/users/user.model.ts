import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { UserRole, UserStatus } from './user.const';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: UserRole,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//pre save middleware or hook in mongoose document middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );

  next();
});

//save '' string after post
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// checking user exist for auth
userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

//checking password math or not
userSchema.statics.isPasswordMatched = async function (
  painPassword,
  hashPassword,
) {
  return await bcrypt.compare(painPassword, hashPassword);
};

//password change time and jwt issued time
userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangeTime,
  JWTIssuedTime,
) {
  const changeTimeMileSecond = new Date(passwordChangeTime).getTime() / 1000;
  return changeTimeMileSecond > JWTIssuedTime;
};

export const User = model<TUser, UserModel>('User', userSchema);
