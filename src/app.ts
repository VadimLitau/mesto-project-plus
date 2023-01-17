import express, { NextFunction, Response, json } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/extensions, import/named
import user from './routes/users';
import card from './routes/card';

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

const { PORT = 3000 } = process.env;

const app = express();

app.use((req: any, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '63c28319509f35db6723c147',
  };

  next();
});

app.use(json());
app.use('/users', user);
app.use('/card', card);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
