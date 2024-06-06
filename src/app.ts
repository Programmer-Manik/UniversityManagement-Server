/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import cors from 'cors';
import express, { Application, Request, Response,} from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());


// testing
const test = async (_req:Request, res:Response) => {
    const a = 10 ;
    res.send(a);
};
app.get('/test', test);



// application routes
app.use('/api/v1/', router);



app.use(globalErrorHandler)

// not found routes
app.use(notFound);

export default app;
