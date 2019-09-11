const { gql, ApolloError } = require("apollo-server");
import { AuthorInterface } from "./author";
import BookSchemaData from "../models/BookModel";
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
import { StringStringMap } from "../interfaces/interfaces";
import { QueryInterface } from "./index";
const { PubSub } = require("apollo-server");
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
  input addBookInput {
    name: String!
    genre: String
    authorId: String!
  }
  extend type Mutation {
    addBook(input: addBookInput): Book
  }
  extend type Subscription {
    bookAdded: Book
  }
`;
const pubsub = new PubSub();
const BOOK_ADDED = "BOOK_ADDED";
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
    addBook: async (parent: any, args: StringStringMap) => {
      //workaround to get rid of [Object: null prototype]
      const { input } = JSON.parse(JSON.stringify(args));

      let book: BookInterface = await BookModel.findOne({
        name: {
          $regex: `${input.name}`,
          $options: "i"
        }
      });
      if (book) {
        console.log(book);
        throw new ApolloError(
          "This book is already in your book list!",
          "DUPLICATE_KEY",
          { field: "name" }
        );
      } else {
        let newBook: BookSchemaData = new BookModel({
          name: input.name,
          genre: input.genre,
          authorId: input.authorId
        });

        // const payload = { bookAdded: newBook };
        pubsub.publish(BOOK_ADDED, { bookAdded: input });
        return newBook.save();
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    }
  }
};
