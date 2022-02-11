import { Schema, model } from "mongoose";
import { ICountdown } from "../../../typings";
const cdSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  gamble: {
    type: Number,
  },
  slot: {
    type: Number,
  },
  rob: {
    type: Number,
  },
  haigusha: {
    type: Number,
  },
  marry: {
    type: Number,
  },
  divorce: {
    type: Number,
  },
  t2pc: {
    type: Number,
  },
  t2party: {
    type: Number,
  },
  catch: {
    type: Number,
  },
  swap: {
    type: Number,
  },
  claim: {
    type: Number,
  },
  swapChara: {
    type: Number,
  },
  sellChara: {
    type: Number,
  },
});
export default model<ICountdown>("countdown", cdSchema);
