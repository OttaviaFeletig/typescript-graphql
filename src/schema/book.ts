const { gql, ApolloError } = require("apollo-server");
import { AuthorInterface } from "./author";
import BookSchemaData from "../models/BookModel";
const AuthorModel = require("../models/AuthorModel");
const BookModel = require("../models/BookModel");
import { StringStringMap } from "../interfaces/interfaces";
const { PubSub } = require("apollo-server");
export interface BookInterface {
  id: string;
  name: string;
  genre: string;
}
interface BookQueryInterface extends BookInterface {
  books: Array<BookInterface>;
}

export const typeDefs = gql`
  type Book {
    id: String
    name: String!
    genre: String
    author: Author
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
    deleteBook(id: String!): Book
  }
  extend type Subscription {
    bookAdded: Book
    bookDeleted: Book
  }
`;
const pubsub = new PubSub();
const BOOK_ADDED = "BOOK_ADDED";
const BOOK_DELETED = "BOOK_DELETED";
export const resolvers = {
  Book: {
    author: (parent: BookSchemaData, args: any): AuthorInterface =>
      AuthorModel.findById(parent.authorId)
  },
  Query: {
    books: (): Array<BookQueryInterface> => BookModel.find(),
    book: (parent: any, args: StringStringMap): BookQueryInterface =>
      BookModel.findById({ _id: args.id })
  },
  Mutation: {
    addBook: async (
      parent: any,
      args: StringStringMap
    ): Promise<BookSchemaData> => {
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
        pubsub.publish(BOOK_ADDED, { bookAdded: input });
        return newBook.save();
      }
    },
    deleteBook: async (
      parent: any,
      args: StringStringMap
    ): Promise<BookInterface> => {
      const { id }: StringStringMap = args;
      let removedBook = await BookModel.findByIdAndDelete({ _id: id });
      if (!removedBook) {
        throw new ApolloError("This book doesn't exist!", "NOT_FOUND", {
          field: "id"
        });
      } else {
        pubsub.publish(BOOK_DELETED, { bookDeleted: removedBook });

        return removedBook;
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    },
    bookDeleted: {
      subscribe: () => pubsub.asyncIterator([BOOK_DELETED])
    }
  }
};
