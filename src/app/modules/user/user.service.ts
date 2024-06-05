
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../Errors/AppError';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// import config from '../../config';
// import { TStudent } from '../student/student.interface';
// import { Student } from '../student/student.model';
// import { AcademicSemester } from './../academicSemester/academicSemester.model';
// import { TUser } from './user.interface';
// import { User } from './user.model';
// import { generateStudentId } from './user.utils';

// const createStudentIntoDB = async (password: string, payload: TStudent) => {
//   // console.log(payload)
//   // create a user object
//   const userData: Partial<TUser> = {};
//   //if password is not given , use default password
//   userData.password = password || (config.default_password as string);
//   //set student role
//   userData.role = 'student';
//   //year semester Code 4 digits number 
//   // find academic semester
//   const admissionSemester = await  AcademicSemester.findById(
//     payload.admissionSemester,
//   );

  
//    //set manually generated it
//   // userData.id = '2030100001';
//   //set  generated id
//   if (!admissionSemester) {
//     throw new Error('Admission semester not found');
//   }
//   userData.id = await generateStudentId(admissionSemester); 


//   // create a user
//   const newUser = await User.create(userData);
//   // console.log(newUser, userData);

//   //create a student
//   if (Object.keys(newUser).length) {
//     // set id , _id as user
//     payload.id = newUser.id;
//     payload.user = newUser._id; //reference _id

//     const newStudent = await Student.create(payload);
//     return newStudent;
//   }
// };

// export const UserServices = {
//   createStudentIntoDB,
// };