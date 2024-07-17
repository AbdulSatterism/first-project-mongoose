/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TGuardian = {
  fathersName: string;
  fathersContactNo: string;
  fathersOccupation: string;
  mothersName: string;
  mothersContactNo: string;
  mothersOccupation: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudentName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TStudentName;
  gender: 'male' | 'female' | 'others';
  contactNo: string;
  emergencyContactNo: string;
  dateOfBirth?: Date;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  email: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

// for static // it's easy

export interface StudentModel extends Model<TStudent> {
  isStudentExists(id: string): Promise<TStudent | null>;
}

//for creating instance
// export type TStudentMethods = {
//   isStudentExists(id: string): Promise<TStudent | null>;
// };

// export type TStudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   TStudentMethods
// >;
