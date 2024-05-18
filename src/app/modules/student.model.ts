import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentName,
} from './student/student.interface';
import bcrypt from 'bcrypt';
import config from '../config';

const studentNameSchema = new Schema<TStudentName>({
  firstName: {
    type: String,
    trim: true,
    maxLength: [20, 'first name will not more than 20 char'],
    required: [true, 'First name is required'],
    // custom  validate function
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
    //     return firstNameStr === value;
    //   },
    //   message:
    //     '{VALUE} is not capitalize string you should start Capital letter',
    // },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'First name is required'],
    //last name validate with validator package
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not valid name',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fathersName: { type: String, required: true },
  fathersContactNo: { type: String, required: true },
  fathersOccupation: { type: String, required: true },
  mothersName: { type: String, required: true },
  mothersContactNo: { type: String, required: true },
  mothersOccupation: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
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
    name: {
      type: studentNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message:
          "{VALUE} is not valid you should use 'male' 'female' or 'others'",
      },
      required: true,
    },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    studentImage: { type: String },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
);

// mongoose virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

//pre save middleware or hook in mongoose document middleware
studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );

  next();
});

//post save middleware or hook in mongoose
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });

  next();
});

//static method
studentSchema.statics.isStudentExists = async function (id: string) {
  const existStudent = await Student.findOne({ id });
  return existStudent;
};

//for instance method
// studentSchema.methods.isStudentExists = async function (id: string) {
//   const existStudent = await Student.findOne({ id });
//   return existStudent;
// };

//3rd
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
