import { model, Schema } from 'mongoose';
import validator from 'validator';
// eslint-disable-next-line import/no-unresolved
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-unresolved, import/no-named-as-default
import { IUser, UserModel } from '../types/user';
import { validateLink } from '../middlewares/validation';

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [200, 'Максимум 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: validateLink,
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: any) => validator.isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
});

export default model<IUser, UserModel>('User', userSchema);
