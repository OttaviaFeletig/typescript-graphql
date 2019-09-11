const { gql } = require("apollo-server");
import { typeDefs as Book, resolvers as bookResolvers } from "./book";
import { typeDefs as Author, resolvers as authorResolvers } from "./author";
import { merge } from "lodash";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

export interface QueryInterface {
  hello: string;
}
const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const typeDefs = [Book, Author, Query];
const resolvers = merge(bookResolvers, authorResolvers);
export const schema = makeExecutableSchema({ typeDefs, resolvers });
