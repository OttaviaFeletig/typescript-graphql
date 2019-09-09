import mongoose, { Schema, Document, model } from "mongoose";

interface AuthorSchemaData extends Document {
  name: string;
  age: number;
}

const AuthorSchema: Schema = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model<AuthorSchemaData>("author", AuthorSchema);
