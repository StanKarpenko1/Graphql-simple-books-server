import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// data
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

const resolvers = {
    Query: {
        allGames () {
            return db.games;
        },
        allReviews () {
            return db.reviews;
        },
        getReview (_, args) {
            return db.reviews.find((review) => review.id === args.id);
        },
        allAuthors () {
            return db.authors;
        }

    }
}

// server setup
const PORT = 4000;
const server = new ApolloServer({
     typeDefs,
     resolvers

});

const { url } = await startStandaloneServer(server, {
    listen: {
        port: PORT,
        path: "/graphql"
    }
});

console.log(`Server ready at port: ${PORT} - url: ${url}`);