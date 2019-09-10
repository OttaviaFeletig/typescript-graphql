const { gql } = require("apollo-server");
import { BookInterface } from "./book";
const BookModel = require("../models/BookModel");
const AuthorModel = require("../models/AuthorModel");
import { StringStringMap } from "../interfaces/interfaces";
import { QueryInterface } from "./index";

export interface AuthorInterface {
  id: string;
  name: string;
  age: number;
  books: Array<BookInterface>;
}

interface AuthorQueryInterface extends QueryInterface {
  authors: Array<AuthorInterface>;
  author: AuthorInterface;
}
export const typeDefs = gql`
  type Author {
    id: String
    name: String!
    age: Int
    books: [Book]
  }
  extend type Query {
    authors: [Author]
    author(id: String!): Author
  }
`;

export const resolvers = {
  Author: {
    books: (parent: AuthorInterface): AuthorInterface["books"] =>
      BookModel.find({ authorId: parent.id })
  },
  Query: {
    authors: (): AuthorQueryInterface["authors"] => AuthorModel.find(),
    author: (
      parent: any,
      args: StringStringMap
    ): AuthorQueryInterface["author"] => AuthorModel.findById({ _id: args.id })
  }
};
