import { findBreakingChanges } from "graphql";

const { ApolloServer, gql } = require("apollo-server");
const _ = require("lodash");
const mongoose = require("mongoose");
const { db } = require("./config/keys");
const BookModule = require("./models/BookModel");
const AuthorModule = require("./models/AuthorModel");

const typeDefs = gql`
  type Book {
    id: String
    name: String
    author: Author
  }

  type Author {
    id: String
    name: String
    books: [Book]
  }

  type Query {
    books: [Book]
    book(id: String): Book
    authors: [Author]
    author(id: String): Author
  }
`;

const resolvers = {
  Query: {
    books: () => BookModule.find(),
    book: (parent: any, args: any) => BookModule.findById({ id: args.id }),
    authors: () => AuthorModule.find(),
    author: (parent: any, args: any) => AuthorModule.findById({ id: args.id })
  },
  Book: {
    author: (parent: any, args: any) => AuthorModule.findById(parent.authorId)
  },
  Author: {
    books: (parent: any, args: any) => BookModule.find({ authorId: parent.id })
  }
};
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("connected!"))
  .catch((error: any) => console.log(error));

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }: any) => {
  console.log(`🚀  Server ready at ${url}`);
});
