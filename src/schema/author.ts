const { gql } = require("apollo-server");
import { BookInterface } from "./book";
import AuthorSchemaData from "../models/AuthorModel";
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
  input addAuthorInput {
    name: String!
    age: Int
  }
  extend type Mutation {
    addAuthor(input: addAuthorInput): Author
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
  },
  Mutation: {
    addAuthor: (parent: any, args: StringStringMap) => {
      const { input } = JSON.parse(JSON.stringify(args));
      let author: AuthorSchemaData = new AuthorModel({
        name: input.name,
        age: input.age
      });
      return author.save();
    }
  }
};
