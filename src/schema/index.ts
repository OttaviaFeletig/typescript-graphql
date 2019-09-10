const { gql } = require("apollo-server");
import { typeDefs as Book, resolvers as bookResolvers } from "./book";
import { typeDefs as Author, resolvers as authorResolvers } from "./author";
import { merge } from "lodash";

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
`;

export const typeDefs = [Book, Author, Query];
export const resolvers = merge(bookResolvers, authorResolvers);
