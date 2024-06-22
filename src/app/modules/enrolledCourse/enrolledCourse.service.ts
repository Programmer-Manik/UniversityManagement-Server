
import { TEnrolledCourse } from "./enrolledCourse.interface"
import httpStatus from "http-status"
import AppError from "../../Errors/AppError"
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import EnrolledCourse from "./enrolledCourse.model"
import { Student } from "../student/student.model"

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


}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}