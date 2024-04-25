
export const typeDefs = `#graphql 
  
  type Game {
      id: ID!
      title: String!
      platform: [String!]!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String!
}
type Author {
      id: ID!
      name: String!
      verified: Boolean!
  }

  type Query {
      allReviews: [Review]
      allGames: [Game]
      allAuthors: [Author]
  }

`
