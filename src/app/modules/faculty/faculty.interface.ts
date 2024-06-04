import { Types } from 'mongoose';

export type TFacultyGender = 'male' | 'female' | 'other';
export type TFacultyBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TFacultyName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TFacultyName;
  gender: TFacultyGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TFacultyBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};
