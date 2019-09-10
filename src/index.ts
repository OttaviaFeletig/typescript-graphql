const { ApolloServer, gql } = require("apollo-server");
const _ = require("lodash");
const mongoose = require("mongoose");
const { db } = require("./config/keys");
import { typeDefs, resolvers } from "./schema/index";

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
