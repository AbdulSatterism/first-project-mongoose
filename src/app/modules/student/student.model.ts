import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentName,
} from './student.interface';

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
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'id is required'],
      unique: true,
      ref: 'User',
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
    dateOfBirth: {
      type: String,
    },
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
    profileImage: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
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
