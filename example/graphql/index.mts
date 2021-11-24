import { ApolloServer, gql } from "apollo-server-azure-functions";
import appInsightsPlugin from "@aaronpowell/apollo-server-plugin-appinsights";
import appInsightsLogger from "@aaronpowell/apollo-server-logger-appinsights";

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
  logger: appInsightsLogger(process.env.APP_INSIGHTS || "graphQL-logger"),
});

export default server.createHandler();
