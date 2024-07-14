import { Types } from 'mongoose';

export type TAdminName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAdminGender = 'male' | 'female' | 'other';
export type TAdminBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TAdminName;
  gender: TAdminGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TAdminBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  isDeleted: boolean;
};
