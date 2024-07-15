import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidation } from './academicSemeter.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.const';

const router = express.Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterSchemaValidation,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterSchemaValidation,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get(
  '/',
  auth(USER_ROLE.admin),
  AcademicSemesterControllers.getAllAcademicSemester,
);

router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
