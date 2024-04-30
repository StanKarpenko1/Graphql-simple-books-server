
export const typeDefs = `#graphql 
  
  type Game {
      id: ID!
      title: String!
      platform: [String!]!
      reviews: [Review!] 
  }

  type Review {
    id: ID!
    rating: Int!
    content: String!
    game_id: String!
    author_id: String!

    game: Game!
    author: Author!
  }  

  type Author {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!] 
  }

  type Query {
      allReviews: [Review]
      getReview(id: ID!): Review
      allGames: [Game] 
      getGame(id: ID!): Game
      allAuthors: [Author]
      getAuthor(id: ID!): Author
  }

  type Mutation {
    addGame (game: AddGameInput!) : Game
    deleteGame (id: ID!): [Game]
    updateGame (id: ID!, edits: EditGameInput): Game
  }
  input AddGameInput {
    title: String!
    platform: [String!]!
  }

  input EditGameInput {
    title: String,
    platform: [String!] 
  }


`
