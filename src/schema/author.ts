const { gql, ApolloError } = require("apollo-server");
import { BookInterface } from "./book";
import AuthorSchemaData from "../models/AuthorModel";
const BookModel = require("../models/BookModel");
const AuthorModel = require("../models/AuthorModel");
import {
  StringStringMap,
  StringNumberMap,
  StringAnyMap
} from "../interfaces/interfaces";
// import { QueryInterface } from "./index";

export interface AuthorInterface {
  id: string;
  name: string;
  age: number;
  // books: Array<BookInterface>;
}

interface AuthorQueryInterface extends AuthorInterface {
  books: Array<BookInterface>;
}

// interface AuthorQueryInterface extends QueryInterface {
//   authors: Array<AuthorInterface>;
//   author: AuthorInterface;
// }

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
  input updateAuthorInput {
    name: String
    age: Int
  }
  extend type Mutation {
    addAuthor(input: addAuthorInput): Author
    updateAuthor(id: String!, input: updateAuthorInput): Author
  }
`;

export const resolvers = {
  Author: {
    books: (parent: AuthorInterface): Array<BookInterface> => {
      return BookModel.find({ authorId: parent.id });
    }
  },
  Query: {
    authors: (): Array<AuthorQueryInterface> => AuthorModel.find(),
    author: (parent: any, args: StringStringMap): AuthorQueryInterface =>
      AuthorModel.findById({ _id: args.id })
  },
  Mutation: {
    addAuthor: async (
      parent: any,
      args: StringAnyMap
    ): Promise<AuthorSchemaData> => {
      //workaround to get rid of [Object: null prototype]
      const { input }: StringAnyMap = JSON.parse(JSON.stringify(args));
      let author: AuthorInterface = await AuthorModel.findOne({
        name: {
          $regex: `${input.name}`,
          $options: "i"
        }
      });
      if (author) {
        throw new ApolloError(
          "This author is already in your book list!",
          "DUPLICATE_KEY",
          { field: "name" }
        );
      } else {
        let newAuthor: AuthorSchemaData = new AuthorModel({
          name: input.name,
          age: input.age
        });
        return newAuthor.save();
      }
    },
    updateAuthor: async (
      parent: any,
      args: StringAnyMap
    ): Promise<AuthorInterface> => {
      const { id }: StringStringMap = args;
      const { input }: StringAnyMap = JSON.parse(JSON.stringify(args));
      //to check if my id is a valid ObjectId from MongoDB
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        let author: AuthorInterface = await AuthorModel.findById({
          _id: id
        });
        if (!author) {
          throw new ApolloError("This author doesn't exist!", "NOT_FOUND", {
            field: "id"
          });
        }
        if (input.name !== undefined) {
          author.name = input.name;
        }
        if (input.age !== undefined) {
          author.age = input.age;
        }
        return author;
      } else {
        throw new ApolloError("Provide a valid id!", "INTERNAL_ERROR", {
          field: "id"
        });
      }
    }
  }
};
