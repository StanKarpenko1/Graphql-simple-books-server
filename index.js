import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./typeDefs";

// server setup
const PORT = 4000;
const server = new ApolloServer({
     typeDefs,
     // resolvers

});

const { url } = await startStandaloneServer(server, {
    listen: {port: PORT}
});

console.log(`Server ready at port: ${PORT} - url: ${url}`);