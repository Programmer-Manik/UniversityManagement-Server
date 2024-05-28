
import cors from 'cors';
import express, { Application,} from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/', router);



app.use(globalErrorHandler)

// not found routes
app.use(notFound);

export default app;
