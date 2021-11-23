import { ApolloServer, gql } from "apollo-server-azure-functions";
import appInsightsPlugin from "@aaronpowell/apollo-server-graphql-appinsights";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello from our GraphQL backend!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [appInsightsPlugin(process.env.APP_INSIGHTS || "")],
});

export default server.createHandler();
