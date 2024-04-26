

describe('GraphQL API Tests', () => {
    const graphqlUrl = 'http://localhost:4000/graphql'; // Adjust if your URL is different
  
    // Function to perform GraphQL queries
   
    const graphqlQuery = (query, variables = {}) => {
      return cy.request ({
        method: 'POST',
        url: graphqlUrl,
        body: {query, variables},
        failOnStatusCode: false
      })
    }
  
    it('Fetches all games', () => {
      const query = `#graphql

        query {
          allGames {
            id
            title
            platform
          }
        }

      `;
      graphqlQuery(query).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data.allGames).to.be.an('array');
      });
    });
  
    it('Fetches all reviews', () => {
      const query = `#graphql

        query {
          allReviews {
            id
            rating
            content
          }
        }

      `;
      graphqlQuery(query).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data.allReviews).to.be.an('array');
        if (response.body.data.allReviews.length > 0) {
          expect(response.body.data.allReviews[0]).to.have.all.keys('id', 'rating', 'content');
        }
      });
    });
  
    it('Fetches all authors', () => {
      const query = `#graphql
        query {
          allAuthors {
            id
            name
            verified
          }
        }
      `;
      graphqlQuery(query).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data.allAuthors).to.be.an('array');
        if (response.body.data.allAuthors.length > 0) {
          expect(response.body.data.allAuthors[0]).to.have.all.keys('id', 'name', 'verified');
        }
      });
    });

    it('Fetches a single review', () => {
      const testReviewId = "1";
      const expectedContent = "lorem ipsum";
    
      const query = `
        query GetReview($id: ID!) {
          getReview(id: $id) {
            id
            rating
            content
          }
        }
      `;
      const variables = {
        id: testReviewId
      };
    
      graphqlQuery(query, variables).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('getReview');
        const review = response.body.data.getReview;
        expect(review).to.have.all.keys('id', 'rating', 'content');
        expect(review.content).to.equal(expectedContent);
        expect(review.id).to.equal(testReviewId);
   
      });
    });
    
  });
  