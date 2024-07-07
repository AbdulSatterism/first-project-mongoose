import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.const';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getAllStudents,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getSingleStudent,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.deleteStudent,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

export const StudentRoutes = router;
