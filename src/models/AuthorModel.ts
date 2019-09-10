import mongoose, { Schema, Document, model } from "mongoose";

export default interface AuthorSchemaData extends Document {
  name: string;
  age: number;
}

const AuthorSchema: Schema = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model<AuthorSchemaData>("author", AuthorSchema);
