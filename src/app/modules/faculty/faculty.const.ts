import { TAdminBloodGroup, TAdminGender } from '../admin/admin.interface';

export const Gender: TAdminGender[] = ['male', 'female', 'other'];

export const BloodGroup: TAdminBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const FacultySearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.lastName',
  'name.middleName',
];
