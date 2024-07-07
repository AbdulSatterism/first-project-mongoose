import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from '../admin/admin.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.const';
import { userValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import { studentValidations } from '../student/student.validation';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE?.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE?.admin),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE?.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE?.admin),
  validateRequest(userValidations.statusChangeSchemaValidation),
  UserControllers.changeStatus,
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  UserControllers.getMe,
);

export const UserRoutes = router;
