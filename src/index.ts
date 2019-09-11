const { ApolloServer } = require("apollo-server-express");
const _ = require("lodash");
const mongoose = require("mongoose");
const { db } = require("./config/keys");
import { schema } from "./schema/index";
const http = require("http");
const express = require("express");
const PORT = 4000;

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("connected!"))
  .catch((error: any) => console.log(error));

const app = express();
const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
