import { Document, Schema, model } from "mongoose";

export type DataMainDocument = Document & {
  MemberID: string;
  GuildID: string;
  Count: number;
};

export const DataMainSchema = new Schema({
  Count: {
    type: Number,
    default: 0,
  },
  MemberID: {
    type: String,
    required: true,
  },
  GuildID: {
    type: String,
    required: true,
  },
});

export const DataMainModel = model<DataMainDocument>(`example`, DataMainSchema);