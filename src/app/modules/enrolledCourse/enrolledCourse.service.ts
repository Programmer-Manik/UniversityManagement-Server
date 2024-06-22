import { TEnrolledCourse } from "./enrolledCourse.interface"

const createEnrolledCourseIntoDB = async (userId:string, payload:TEnrolledCourse) => {
    /**
     * step 1: Check if the offered course is exists 
     * Step 2: check if the student is already enrolled 
     * Step 3: create on enrolled course
     */

}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}