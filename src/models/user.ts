import mongoose, {Document, Model} from 'mongoose';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 4},
  email: {type: String, required: true, unique: [true, 'Email must be unique']},
  password: {type: String, required: true}
}, {
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret.__id;
      delete ret.__id;
      delete ret.__v;
    }
  }
});

interface UserModel extends Omit<User, '_id'>, Document {}

export const User: Model<UserModel> = mongoose.model('user', schema); 