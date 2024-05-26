import { z } from 'zod';

const studentNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, { message: 'First name cannot be more than 20 characters' })
    .refine((value) => value.charAt(0) === value.charAt(0).toUpperCase(), {
      message: 'First name must start with a capital letter',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last name must only contain alphabetic characters',
    }),
});

// Guardian schema
const guardianValidationSchema = z.object({
  fathersName: z.string().min(1, { message: "Father's name is required" }),
  fathersContactNo: z
    .string()
    .min(1, { message: "Father's contact number is required" }),
  fathersOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  mothersName: z.string().min(1, { message: "Mother's name is required" }),
  mothersContactNo: z
    .string()
    .min(1, { message: "Mother's contact number is required" }),
  mothersOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required" }),
});

// LocalGuardian schema
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: "Local guardian's name is required" }),
  occupation: z
    .string()
    .min(1, { message: "Local guardian's occupation is required" }),
  contactNo: z
    .string()
    .min(1, { message: "Local guardian's contact number is required" }),
  address: z
    .string()
    .min(1, { message: "Local guardian's address is required" }),
});

// Student schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: studentNameValidationSchema,
      gender: z.enum(['male', 'female', 'others']),
      contactNo: z.string().min(1, { message: 'Contact number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number is required' }),
      dateOfBirth: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      email: z.string().email({ message: 'Invalid email address' }),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImage: z.string().url().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
