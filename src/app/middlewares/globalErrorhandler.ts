/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZoneError from '../Errors/handleZodError';

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


  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if(err instanceof ZodError){
    const simplifiedError = handleZoneError(err)
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }else if(err?.name === 'validationError'){
    const simplifiedError = handleZoneError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSource = simplifiedError?.errorSource
  }
//ultimate returns
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack:config.node_env === 'development'? err?.stack:null,
  });
};

export default globalErrorHandler;