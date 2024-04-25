
export const typeDefs = `#graphql 
  
  type Game {
      id: ID!
      title: String!
      platform: [String!]!
  }

  type Rewiew {
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
      reviews: [Review]
      games: [Game]
      authors: [Author]
  }

`
