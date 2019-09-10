import { findBreakingChanges } from "graphql";

const { ApolloServer, gql } = require("apollo-server");
const _ = require("lodash");
const mongoose = require("mongoose");
const { db } = require("./config/keys");
const BookModel = require("./models/BookModel");
import BookSchemaData from "./models/BookModel";
const AuthorModel = require("./models/AuthorModel");
import { typeDefs, resolvers } from "./schema/index";
import { BookInterface } from "./schema/book";
import { AuthorInterface } from "./schema/author";

// interface Book {
//   id: string;
//   name: string;
//   genre: string;
//   author: Author;
// }
// interface Author {
//   id: string;
//   name: string;
//   age: number;
//   books: Array<Book>;
// }

// interface Query {
//   books: Array<Book>;
//   book: Book;
//   authors: Array<Author>;
//   author: Author;
// }

// const Book: Book = gql`
//   type Book {
//     id: String
//     name: String!
//     genre: String
//     author: Author!
//   }
// `;

// const Author: Author = gql`
//   type Author {
//     id: String
//     name: String!
//     age: Int
//     books: [Book]
//   }
// `;
// const Query: Query = gql`
//   type Query {
//     books: [Book]
//     book(id: String): Book
//     authors: [Author]
//     author(id: String): Author
//   }
// `;

// interface Mutation {
//   addBook(name: string, genre: string, authorId: string): Book;
//   addAuthor(name: string, age: number): Author;
// }

// const Mutation: Mutation = gql`
//   type Mutation {
//     addBook(name: String, genre: String, authorId: String): Book
//     addAuthor(name: String, age: Int): Author
//   }
// `;

// interface StringTMap<T> {
//   [key: string]: T;
// }
// interface StringStringMap extends StringTMap<string> {}

// const resolvers = {
// Query: {
//   books: (): Array<BookType> => BookModel.find(),
//   book: (parent: any, args: StringStringMap): BookType =>
//     BookModel.findById({ _id: args.id }),
//   authors: (): Array<AuthorType> => AuthorModel.find(),
//   author: (parent: any, args: StringStringMap): AuthorType =>
//     AuthorModel.findById({ _id: args.id })
// },
// Book: {
//   author: (parent: BookSchemaData, args: any): AuthorType =>
//     AuthorModel.findById(parent.authorId)
// },
// Author: {
//   books: (parent: AuthorType): Array<BookType> =>
//     BookModel.find({ authorId: parent.id })
// }
// Mutation: {
//   addBook: (parent: any, args: StringStringMap): Mutation["addBook"] => {
//     let book = new BookModel({
//       name: args.name,
//       genre: args.genre,
//       authorId: args.authorId
//     });
//     return book.save();
//   },
//   addAuthor: (parent: any, args: StringStringMap): Mutation["addAuthor"] => {
//     let author = new AuthorModel({
//       name: args.name,
//       age: args.age
//     });
//     return author.save();
//   }
// }
// };
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("connected!"))
  .catch((error: any) => console.log(error));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }: any) => {
  console.log(`🚀  Server ready at ${url}`);
});
