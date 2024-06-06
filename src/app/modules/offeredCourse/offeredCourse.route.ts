import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidation),
  OfferedCourseControllers.createOfferedCourse,
);

router.get('/');

router.get('/:id');

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidation),
  OfferedCourseControllers.updateOfferedCourse,
);

export const OfferedCourseRoutes = router;
