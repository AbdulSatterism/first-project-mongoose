import Joi from 'joi';

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// StudentName schema
const studentNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .required()
    .custom((value, helpers) => {
      if (value !== capitalizeFirstLetter(value)) {
        return helpers.error('any.invalid', {
          message: 'First name must start with a capital letter',
        });
      }
      return value;
    }, 'Capitalization validation'),
  middleName: Joi.string().trim().allow(''),
  lastName: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z]+$/, 'alpha')
    .messages({
      'string.pattern.name':
        'Last name must only contain alphabetic characters',
    }),
});

// Guardian schema
const guardianValidationSchema = Joi.object({
  fathersName: Joi.string().required(),
  fathersContactNo: Joi.string().required(),
  fathersOccupation: Joi.string().required(),
  mothersName: Joi.string().required(),
  mothersContactNo: Joi.string().required(),
  mothersOccupation: Joi.string().required(),
});

// LocalGuardian schema
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

// Student schema
const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: studentNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'others').required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  email: Joi.string().email().required(),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  studentImage: Joi.string().uri(),
});

export default studentValidationSchema;
