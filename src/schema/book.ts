const { gql } = require("apollo-server");
import { AuthorInterface } from "./author";
import BookSchemaData from "../models/BookModel";
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
import { StringStringMap } from "../interfaces/interfaces";
import { QueryInterface } from "./index";

export interface BookInterface {
  id: string;
  name: string;
  genre: string;
  author: AuthorInterface;
}
interface BookQueryInterface extends QueryInterface {
  books: Array<BookInterface>;
  book: BookInterface;
}

export const typeDefs = gql`
  type Book {
    id: String
    name: String!
    genre: String
    author: Author!
  }
  extend type Query {
    books: [Book]
    book(id: String!): Book
  }
  extend type Mutation {
    addBook(name: String!, genre: String, authorId: String!): Book
  }
`;
export const resolvers = {
  Book: {
    author: (parent: BookSchemaData, args: any): AuthorInterface =>
      AuthorModel.findById(parent.authorId)
  },
  Query: {
    books: (): BookQueryInterface["books"] => BookModel.find(),
    book: (parent: any, args: StringStringMap): BookQueryInterface["book"] =>
      BookModel.findById({ _id: args.id })
  },
  Mutation: {
    addBook: (parent: any, args: StringStringMap) => {
      let book: BookSchemaData = new BookModel({
        name: args.name,
        genre: args.genre,
        authorId: args.authorId
      });
      return book.save();
    }
  }
};
