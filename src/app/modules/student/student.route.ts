import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/:id',
  auth('admin', 'faculty'),
  StudentControllers.getSingleStudent);

router.patch(
    '/:id',
    validateRequest(updateStudentValidationSchema),
    StudentControllers.updateStudent,
  );

router.delete('/:id', StudentControllers.deleteStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;

