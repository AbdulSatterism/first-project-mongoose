import { z } from 'zod';

const createAcademicDepartmentSchemaValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Department must  be string',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'must have academic faculty',
    }),
  }),
});

const updateAcademicDepartmentSchemaValidation = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Department must  be string',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'must have academic faculty',
      })
      .optional(),
  }),
});

export const academicDepartmentValidation = {
  createAcademicDepartmentSchemaValidation,
  updateAcademicDepartmentSchemaValidation,
};
