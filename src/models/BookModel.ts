import mongoose, { Schema, Document } from "mongoose";

export default interface BookSchemaData extends Document {
  name: string;
  genre: string;
  authorId: string;
}

const BookSchema: Schema = new Schema({
  name: String,
  genre: String,
  authorId: String
});

module.exports = mongoose.model<BookSchemaData>("book", BookSchema);
