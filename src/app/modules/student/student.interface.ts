export type Guardian = {
  fathersName: string;
  fathersContactNo: string;
  fathersOccupation: string;
  mothersName: string;
  mothersContactNo: string;
  mothersOccupation: string;
};

export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type StudentName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type Student = {
  id: string;
  name: StudentName;
  gender: 'male' | 'female';
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  email: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  localGuardian: LocalGuardian;
  studentImage?: string;
};
