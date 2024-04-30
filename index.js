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
       
        allAuthors () {
            return db.authors;
        },
        
        getGame (_, args) {
            const gameFound = db.games.find((game) => game.id === args.id);
            if (!gameFound){
             throw new Error(`Game with ID ${args.id} is not exist`);
            }
             return gameFound;
         },
         getReview (_, args) {
            const reviewFound = db.reviews.find((review) => review.id === args.id);
            if(!reviewFound) throw new Error(`Review with ID ${args.id} is not exist`);
            
            return reviewFound
        },
        getAuthor (_, args) {
            const authorFound = db.authors.find((author) => author.id === args.id)
            if(!authorFound) throw new Error(`Author with ID ${args.id} is not exist`);

            return authorFound
        },
    },
    Game: {
        reviews ( parent ) {
            return db.reviews.filter((r) => r.game_id  === parent.id)
        }
    },
    Author: {
        reviews ( parent ) {
            return db.reviews.filter((r) => r.author_id === parent.id)
        }
    },
    Review: {
        game (parent ) {
            return db.games.find((g) => g.id === parent.game_id)
        },
        author (parent) {
            return db.authors.find((a) => a.id === parent.author_id)
        }
    },
    Mutation: {
        deleteGame (_, args) {
            db.games = db.games.filter((g) => g.id !== args.id)
            return db.games
        },
        addGame (_, args) {
            let game = {
                ...args.game,
                id: String(db.games.length + 1)
            };
            db.games.push(game);

            return game;
        },
        updateGame (_, args) {
            let gameFound = false;

            db.games = db.games.map((g) => {
                
                if (g.id === args.id) {
                    gameFound = true;
                    return {
                        ...g,
                        ...args.edits
                    }
                }
                return g
            });

            if (!gameFound) {

               const newGame = {
                id: args.id,
                ...args.edits
               }
               db.games.push(newGame);
               return newGame;
            }

            return db.games.find((g) => g.id === args.id)
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