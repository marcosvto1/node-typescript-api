import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true},
    lng: { type: Number, required: true},
    name: { type: Number, required: true },
    position: { type: Number, required: true },
  }, {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);
// cria um tipo que inclui as funcões do mongoose para models (save, find) + interface Beach attributts
interface BeachModel extends Omit<Beach, '_id'>, Document {}

export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);