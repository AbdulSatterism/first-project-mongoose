import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultyFromCourse,
);

router.get('/', CourseControllers.getAllCourse);

router.get('/:id', CourseControllers.getSingleCourse);

router.delete('/:id', CourseControllers.deleteCourse);

router.delete('/:id');

export const CourseRoutes = router;
