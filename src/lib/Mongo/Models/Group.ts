import { model, Schema } from "mongoose";
import { IGroupModel } from "../../../typings";

const GroupSchema = new Schema({
  // This is the id of the group
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  // whether to enable the events for this group. Events are 'add' 'remove' events.
  events: {
    type: Boolean,
    required: false,
    default: false,
  },
  // whether to allow nsfw commands for this group.
  nsfw: {
    type: Boolean,
    required: false,
    default: false,
  },
  // TODO: NSFW checker.
  safe: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Remove people who post group links.
  mod: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Are commands enabled for this group.
  cmd: {
    type: Boolean,
    required: false,
    default: true,
  },
  // Can people ask for Invite link of this group?
  invitelink: {
    type: Boolean,
    required: false,
    default: false,
  },
  //Will broadcast news
  news: {
    type: Boolean,
    required: false,
    default: false,
  },

  chara: {
    type: Boolean,
    required: false,
    default: false,
  },

  bot: {
    type: String,
    required: false,
    default: "all",
  },
  wild: {
    type: Boolean,
    required: false,
    default: false,
  },
  lastPokemon: {
    type: String,
    required: false,
  },

  pId: {
    type: Number,
    required: false,
  },

  pLevel: {
    type: Number,
    required: false,
  },

  pImage: {
    type: String,
    required: false,
  },

  catchable: {
    type: Boolean,
    required: false,
    default: false,
  },
  trade: {
    type: Boolean,
  },
  startedBy: {
    type: String,
  },
  tOffer: {
    name: {
      type: String,
    },
    id: {
      type: Number,
    },
    level: {
      type: Number,
    },
    image: {
      type: String,
    },
  },

  tWant: {
    type: String,
  },

  haigushaResponse: {
    name: String,
    id: Number,
    claimable: Boolean,
  },
  quizResponse: {
    id: Number,
    answer: Number,
    ongoing: Boolean,
    startedBy: String,
  },
  charaResponse: {
    id: Number,
    name: String,
    image: String,
    claimable: Boolean,
    price: Number,
    about: String,
    source: String,
  },
  charaTrade: {
    ongoing: Boolean,
    startedBy: String,
    for: {
      id: Number,
      name: String,
      source: String,
    },
    offer: {
      id: Number,
      name: String,
      image: String,
      about: String,
      source: String,
    },
  },
});

export default model<IGroupModel>("groups", GroupSchema);
