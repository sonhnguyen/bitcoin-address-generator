import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import ApplicationError from './errors/application-error';
import logger from './logger';
import routes from './routes';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(routes);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    if (process.env.NODE_ENV === 'development') {
        logger.log({
            level: 'error',
            message: 'Error in request handler',
            error: err
        });
    }

    return res.status(err.status || 500).json({
        error: err,
        message: err.message
    });
});

export default app;
