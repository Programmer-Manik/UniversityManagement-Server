// import mongoose from 'mongoose';
import mongoose from 'mongoose';
import { Student } from './student.model';
import { User } from '../user/user.model';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find().populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      model: 'AcademicFaculty',
    },
  })
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const ObjectId = mongoose.Types.ObjectId;
  // const result = await Student.aggregate([{ $match: { _id: new ObjectId(id) } }]);
  const result = await Student.findOne({id}).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      model: 'AcademicFaculty',
    },
  })
  return result;
};

const updateStudentIntoDB = async (id: string, payload:Partial<TStudent>) => {
   const {name, guardian, localGuardian, ...remainingStudentData} = payload;
 
 const modifiedUpdatedData : Record<string, unknown> = {
  ...remainingStudentData,
 }

 if(name && Object.keys(name).length > 0){
  for(const [key, value] of Object.entries(name)){
    modifiedUpdatedData[`name.${key}`] = value
  }
 }
 if(guardian && Object.keys(guardian).length > 0){
  for(const [key, value] of Object.entries(guardian)){
    modifiedUpdatedData[`guardian.${key}`] = value
  }
 }
 if(localGuardian && Object.keys(localGuardian).length > 0){
  for(const [key, value] of Object.entries(localGuardian)){
    modifiedUpdatedData[`localGuardian.${key}`] = value
  }
 }
 
   const result = await Student.findOneAndUpdate(
    {id},
    modifiedUpdatedData,
    {new:true, runValidators: true}
  )
    return result;
}

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try{
    session.startTransaction();

    const deleteStudent = await Student.findOneAndUpdate(
      {id},
      {isDeleted: true},
      {new:true, session}
    );
    if(!deleteStudent){
      throw new AppError(httpStatus.BAD_REQUEST,'failed to delete student');
    }

    const deleteUser = await User.findOneAndUpdate(
      {id},
      {isDeleted: true},
      {new:true, session}

    )
    if(!deleteUser){
      throw new AppError( httpStatus.BAD_REQUEST,'failed to delete student');
    }
    await session.commitTransaction();
    await  session.endSession();
    return deleteStudent;
  }catch(err){
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');

};
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};