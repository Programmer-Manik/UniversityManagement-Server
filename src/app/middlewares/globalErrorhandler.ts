/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Something went wrong!';

//   return res.status(statusCode).json({
//     success: false,
//     message,
//     error: err,
//   });

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  //settings default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  type TErrorSource = {
    path:string | number;
    message:string;
  }[];

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];


  if(err instanceof ZodError){
    statusCode = 400;
    message =  'Something went wrong!';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    error: err,
  });
};

export default globalErrorHandler;