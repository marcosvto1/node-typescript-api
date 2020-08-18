import mongoose from 'mongoose';


export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
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
)