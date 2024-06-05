// import mongoose from 'mongoose';
import { Student } from './student.model';

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
  const result = await Student.findById(id).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      model: 'AcademicFaculty',
    },
  })
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};