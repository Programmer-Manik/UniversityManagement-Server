// import mongoose from 'mongoose';
import mongoose from 'mongoose';
import { Student } from './student.model';
import { User } from '../user/user.model';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //   // console.log('base query', query);
  //     const queryObj = {...query}
  //   //{email:{$regex: searchTerm, $options:i}}
  //   // { presentAddress:{$regex: query.searchTerm, $options:i}}
  //   // {name.firstName:{$regex: query.searchTerm, $options:i}
  //   const studentSearchFields = ['email', 'name.lastName', 'presentAddress'];
  //   let searchTerm = '';
  //   if (query?.searchTerm) {
  //     searchTerm = query?.searchTerm as string;
  //   }
  //   const searchQuery = Student.find({
  //     $or:studentSearchFields.map((field) => ({
  //       [field]: {
  //         $regex: searchTerm,
  //         $options: 'i',
  //       },
  //     })),
  //   })

  //   //filtering
  //   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  //   excludeFields.forEach((el) => delete queryObj[el]);  // DELETING THE FIELDS SO THAT IT CAN'T MATCH OR FILTER EXACTLY
  // console.log({query}, {queryObj})

  // //   const result = await searchQuery.find(queryObj)
  // //     .populate('admissionSemester')
  // //     .populate({
  // //       path: 'academicDepartment',
  // //       populate: {
  // //         path: 'academicFaculty',
  // //         model: 'AcademicFaculty',
  // //       },
  // //     });
  // //   return result;
  // // };

  //   const filterQuery = searchQuery
  //     .find(queryObj)
  //     .populate('admissionSemester')
  //     .populate({
  //       path: 'academicDepartment',
  //       populate: {
  //         path: 'academicFaculty',
  //       },
  //     });

  //  // SORTING FUNCTIONALITY:

  //  let sort = '-createdAt'; // SET DEFAULT VALUE

  //  // IF sort  IS GIVEN SET IT

  //    if (query.sort) {
  //     sort = query.sort as string;
  //   }

  //    const sortQuery = filterQuery.sort(sort);
  //   // return sortQuery;

  //     // PAGINATION FUNCTIONALITY:

  //     let page = 1; // SET DEFAULT VALUE FOR PAGE
  //     let limit = 1; // SET DEFAULT VALUE FOR LIMIT
  //     let skip = 0; // SET DEFAULT VALUE FOR SKIP

  //    // IF limit IS GIVEN SET IT

  //    if (query.limit) {
  //      limit = Number(query.limit);
  //    }

  //    // IF page IS GIVEN SET IT

  //    if (query.page) {
  //      page = Number(query.page);
  //      skip = (page - 1) * limit;
  //    }

  //    const paginateQuery = sortQuery.skip(skip);

  //    const limitQuery = paginateQuery.limit(limit);

  //    // FIELDS LIMITING FUNCTIONALITY:

  //    // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH

  //   //  fields: 'name,email'; // WE ARE ACCEPTING FROM REQUEST
  //   //  fields: 'name email'; // HOW IT SHOULD BE

  //    let fields = '-__v'; // SET DEFAULT VALUE

  //    if (query.fields) {
  //      fields = (query.fields as string).split(',').join(' ');

  //    }

  //    const fieldQuery = await limitQuery.select(fields);

  //    return fieldQuery;

  const studentsQuery = new QueryBuilder(Student.find().populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      // model: 'AcademicFaculty',
    },
  }), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await studentsQuery.modelQuery;
    return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const ObjectId = mongoose.Types.ObjectId;
  // const result = await Student.aggregate([{ $match: { _id: new ObjectId(id) } }]);
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        model: 'AcademicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length > 0) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length > 0) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete student');
    }

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete student');
    }
    await session.commitTransaction();
    await session.endSession();
    return deleteStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
