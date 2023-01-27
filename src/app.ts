import express, { Response, json } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
// eslint-disable-next-line import/extensions, import/named
import user from './routes/users';
import card from './routes/card';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUser, login } from './controllers/users';
import errorHandler from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { validateCreateUser, validateLogin } from './middlewares/validation';

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());
app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', user);
app.use('/cards', card);

app.get('*', (_req: any, _res: Response) => {
  _res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);
app.use(errors);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
