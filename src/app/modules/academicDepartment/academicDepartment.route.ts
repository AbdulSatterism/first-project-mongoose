import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.const';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentSchemaValidation,
  ),
  AcademicDepartmentController.createAcademicDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentSchemaValidation,
  ),
  AcademicDepartmentController.updateAcademicDepartment,
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartment);

router.get(
  '/:departmentId',
  AcademicDepartmentController.getSingleAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
