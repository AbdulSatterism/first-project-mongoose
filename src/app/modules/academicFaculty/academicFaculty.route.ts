import express from 'express';
import { academicFacultyValidation } from './academicFaculty.validation';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.const';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicFacultyValidation.createAcademicFacultySchemaValidation,
  ),
  AcademicFacultyController.createAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultySchemaValidation,
  ),
  AcademicFacultyController.updateAcademicFaculty,
);

router.get('/', AcademicFacultyController.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyController.getSingleAcademicFaculty);

export const AcademicFacultyRoutes = router;
