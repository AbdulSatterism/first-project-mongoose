import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  StudentName,
} from './student/student.interface';

const studentNameSchema = new Schema<StudentName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const guardianSchema = new Schema<Guardian>({
  fathersName: { type: String, required: true },
  fathersContactNo: { type: String, required: true },
  fathersOccupation: { type: String, required: true },
  mothersName: { type: String, required: true },
  mothersContactNo: { type: String, required: true },
  mothersOccupation: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
  id: { type: String },
  name: studentNameSchema,
  gender: ['male', 'female'],
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  email: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  studentImage: { type: String },
});

//3rd
export const StudentModel = model<Student>('Student', studentSchema);
