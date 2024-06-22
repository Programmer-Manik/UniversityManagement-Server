import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/Faculty/faculty.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../modules/OfferedCourse/OfferedCourse.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path:'/faculties',
    route:FacultyRoutes
  },
  {
    path:'/admins',
    route:AdminRoutes
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path:'/courses',
    route:CourseRoutes
  },
  {
    path:'/semester-registrations',
    route:semesterRegistrationRoutes
  },
  {
    path:'/offered-course',
    route:offeredCourseRoutes
  },
  {
    path:'/auth',
    route:AuthRoutes
  },
  {
    path:'/enrolled-course',
    route:EnrolledCourseRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;