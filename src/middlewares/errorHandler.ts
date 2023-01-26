/* eslint indent: "error", eol-last: ["error", "never"] */

import { NextFunction, Request, Response } from 'express';

const errorHandler = (err:any, req:Request, res:Response, next: NextFunction) => {
    // console.log(err);

    const statusCode = err.statusCode || 500;
    const messages = err.message || 'Произошла ошибка1';
    res.status(statusCode).send(statusCode === 500 ? { message: 'Произошла ошибка2' } : { message: messages });

    next();
};

export default errorHandler;