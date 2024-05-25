
import { RequestHandler,  } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent:RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { password, student: studentData } = req.body;

    // const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is retrieved Successfully',
        data: result,
      });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};