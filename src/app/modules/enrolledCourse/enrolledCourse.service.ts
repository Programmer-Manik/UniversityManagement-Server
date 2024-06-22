/* eslint-disable @typescript-eslint/no-explicit-any */

import { TEnrolledCourse } from "./enrolledCourse.interface"
import httpStatus from "http-status"
import AppError from "../../Errors/AppError"
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import EnrolledCourse from "./enrolledCourse.model"
import { Student } from "../student/student.model"
import mongoose from "mongoose"

const createEnrolledCourseIntoDB = async (userId:string, payload:TEnrolledCourse) => {
   
    /**
     * step 1: Check if the offered course is exists 
     * Step 2: check if the student is already enrolled 
     * Step 3: create on enrolled course
     */
    const {offeredCourse} = payload

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    if(!isOfferedCourseExists){
        throw new AppError(httpStatus.NOT_FOUND, 'This offered course is not found!')
    }

    if(isOfferedCourseExists.maxCapacity <= 0){
        throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full!')
    }


    const student =  await Student.findOne({id:userId}).select('id')
    if(!student){
        throw new AppError(httpStatus.NOT_FOUND, 'This student is not found!')
    }
   
    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse,
        student:student?.id
    })

    if(isStudentAlreadyEnrolled){
        throw new AppError(httpStatus.CONFLICT, 'This student is already enrolled!')
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
    

    const result = await EnrolledCourse.create(
        [{
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            academicSemester: isOfferedCourseExists.academicSemester,
            academicFaculty: isOfferedCourseExists.academicFaculty,
            academicDepartment: isOfferedCourseExists.academicDepartment,
            offeredCourse: offeredCourse,
            course: isOfferedCourseExists.course,
            student: student._id,
            faculty: isOfferedCourseExists.faculty,
            isEnrolled: true,
 }],{session}
);
    if(!result){
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to enroll in this course")
    }
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse,
       {
        maxCapacity: maxCapacity - 1
       }
    )
    await session.commitTransaction();
    await session.endSession();
    return result
    }catch(err:any){
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err)
    }
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}