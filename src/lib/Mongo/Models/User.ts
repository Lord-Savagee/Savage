import { Schema, model } from "mongoose";
import { IUserModel } from "../../../typings";
const UserSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  ban: {
    type: Boolean,
    required: true,
    default: false,
  },
  warnings: {
    type: Number,
    required: true,
    default: 0,
  },
  Xp: {
    type: Number,
    required: true,
    default: 0,
  },
  wallet: {
    type: Number,
    required: true,
    default: 0,
  },
  bank: {
    type: Number,
    required: true,
    default: 0,
  },
  lastDaily: {
    type: Number,
  },
  lastRob: {
    type: Number,
  },
  pokemons: {
    type: [String],
  },
  party: [
    {
      id: Number,
      level: Number,
      name: String,
      image: String,
    },
  ],
  pc: [
    {
      id: Number,
      level: Number,
      name: String,
      image: String,
    },
  ],
  haigusha: {
    name: String,
    id: Number,
  },
  married: {
    type: Boolean,
    default: false,
    required: false,
  },
  lastQuizId: {
    type: Number,
  },
  quizPoints: {
    type: Number,
    default: 0,
    required: false,
  },
  gallery: [
    {
      id: Number,
      name: String,
      image: String,
      about: String,
      source: String,
    },
  ],
});
export default model<IUserModel>("users", UserSchema);
