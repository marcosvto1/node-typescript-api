import mongoose, {Document, Model} from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
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

interface UserModel extends User, Document {}

export const User: Model<UserModel> = mongoose.model('user', schema); 