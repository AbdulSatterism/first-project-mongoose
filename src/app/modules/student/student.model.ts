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
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'First name is required'],
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
      type: Date,
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
    profileImage: { type: String, default: '' },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
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
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
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

//check document exist or not then update
// studentSchema.pre('findOneAndUpdate', async function (next) {
//   const query = this.getQuery();
//   const isStudentExist = await Student.findOne(query);
//   if (!isStudentExist) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       'This student not available in db',
//     );
//   }
//   next();
// });

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
