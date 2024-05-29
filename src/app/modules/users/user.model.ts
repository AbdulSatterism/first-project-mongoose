import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
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

//check document exist or not then update
// userSchema.pre('findOneAndUpdate', async function (next) {
//   const query = this.getQuery();
//   const isUserExist = await User.findOne(query);
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user not available in db');
//   }
//   next();
// });

export const User = model<TUser>('User', userSchema);
