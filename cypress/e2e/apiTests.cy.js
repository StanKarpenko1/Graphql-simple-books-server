

describe('GraphQL API Tests', () => {
    const graphqlUrl = 'http://localhost:4000/graphql'; 
  
    //#region functions
    const graphqlQuery = (query, variables = {}) => {
      return cy.request ({
        method: 'POST',
        url: graphqlUrl,
        body: {query, variables},
        failOnStatusCode: false
      })
    }

    const graphqlMutation = (mutation, variables = {}) => {
      return cy.request ({
        method: 'POST',
        url: graphqlUrl,
        body: {
          query: mutation, 
          variables: variables
        },
        failOnStatusCode: false
      })
    }
    //#endregion

    context ('Positive Tests', () => {
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
  
      it ('Fetches a single game', () => {
        const testGameId = "2";
        const expectedGame = "Final Fantasy 7 Remake";
  
        const query = `#graphql
          query GetGame($id: ID!) {
            getGame(id: $id) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          id: testGameId
        };
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data).to.have.property('getGame');
          
          const game = response.body.data.getGame;
  
          expect(game).to.have.all.keys('id', 'title', 'platform');
          expect(game.title).to.equal(expectedGame);
          expect(game.id).to.equal(testGameId);
        })
  
  
  
      });
  
      it('Fetches a single author', () => {
        const testAuthorId = "3";
        const expectedAuthor = "peach";
      
        const query = `
          query GetAuthor($id: ID!) {
            getAuthor(id: $id) {
              id
              name
              verified
            }
          }
        `;
        const variables = {
          id: testAuthorId
        };
      
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data).to.have.property('getAuthor');
          
          const author = response.body.data.getAuthor;
  
          expect(author).to.have.all.keys('id', 'name', 'verified');
          expect(author.name).to.equal(expectedAuthor);
          expect(author.id).to.equal(testAuthorId);
     
        });
      });

      it('Fetches a game with its reviews', () => {
        const testGameId = "2"; 
    
        const query = `#graphql
          query GetGameWithReviews($id: ID!) {
            getGame(id: $id) {
              id
              title
              platform
              reviews {
                id
                rating
                content
                game_id
                author_id
              }
            }
          }
        `;
        const variables = {
          id: testGameId
        };
    
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.getGame).to.not.be.null;
          expect(response.body.data.getGame.id).to.equal(testGameId);
    
          // Check the nested reviews
          const reviews = response.body.data.getGame.reviews;
          expect(reviews).to.be.an('array').that.is.not.empty;
          reviews.forEach(review => {
            expect(review).to.have.all.keys('id', 'rating', 'content', 'game_id', 'author_id');
            expect(review.game_id).to.equal(testGameId); 
          });
        });
      });

      it ('Fetches an author with their reviews', () => {
        const testAuthorId = "2";
    
        const query = `#graphql
          query GetAuthorWithReviews($id: ID!) {
            getAuthor(id: $id) {
              id
              name
              verified
              reviews {
                id
                rating
                content
                game_id
                author_id
              }
            }
          }
        `;
        const variables = {
          id: testAuthorId
        };
    
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.getAuthor).to.not.be.null;
          expect(response.body.data.getAuthor.id).to.equal(testAuthorId);
    
          // Check the nested reviews
          const reviews = response.body.data.getAuthor.reviews;
          expect(reviews).to.be.an('array').that.is.not.empty;
          reviews.forEach(review => {
            expect(review).to.have.all.keys('id', 'rating', 'content', 'game_id', 'author_id');
            expect(review.author_id).to.equal(testAuthorId); 
          });
        });
      });

      it('successfully deletes a game by ID', () => {
        const testGameId = "2";

        const mutation = `#graphql
          mutation deleteGame ($id: ID!) {
            deleteGame(id: $id) {
              id
              title
              platform
            }
          }
        `
        const variables = {
          id: testGameId
        }

        graphqlMutation(mutation, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.deleteGame).to.exist;
          const afterDeleteGameReturn = response.body.data.deleteGame;

          const deletedGameExist = afterDeleteGameReturn.some((g) => g.id === testGameId);
          expect(deletedGameExist).to.be.false;

        })

      })

      it ('add a game and return a game with an id', () => {
        const mutation = `#graphql
          mutation addGame($game: AddGameInput!) {
            addGame(game: $game) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          game: {
            title: 'New Game',
            platform: ['Switch', 'PS5']
          }
        };
        graphqlMutation(mutation, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.addGame).to.have.all.keys('id', 'title', 'platform');
          const createdGame = response.body.data.addGame;
          expect(createdGame.title).to.equal(variables.game.title);
          expect(createdGame.platform).to.deep.equal(variables.game.platform);
        });
      })

      it ('update a game and return a game with an id', () => {

        const testGameId = "3";
        const mutation = `#graphql
          mutation updateGame($id: ID!, $edits: EditGameInput!) {
            updateGame(id: $id, edits: $edits) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          id: testGameId,
          edits: {
            title: 'Updated Game',
            platform: ['Switch', 'PS5']
          }
        };
        graphqlMutation(mutation, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.updateGame).to.have.all.keys('id', 'title', 'platform');
          const updatedGame = response.body.data.updateGame;
          expect(updatedGame.title).to.equal(variables.edits.title);
          expect(updatedGame.platform).to.deep.equal(variables.edits.platform);
        });
      })

      it ('should creste a new game with update mutation when game is not in a DB', () => {
        const gemeNotInDB = "9999";

        const thisEdits = {
          title: 'Updated Game',
          platform: ['Switch', 'PS5']
        }

        const mutation = `#graphql
          mutation updateGame($id: ID!, $edits: EditGameInput!) {
            updateGame(id: $id, edits: $edits) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          id: gemeNotInDB,
          edits: thisEdits
        };

        graphqlMutation(mutation, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.updateGame).to.have.all.keys('id', 'title', 'platform');
          const updatedGame = response.body.data.updateGame;
          expect(updatedGame.title).to.equal(variables.edits.title);
          expect(updatedGame.platform).to.deep.equal(variables.edits.platform);
        });
      })

      it ('should update game', () => {
        const thisGameId = "2";

        const thisEdits = {
          title: 'Updated Game',
          platform: ['Switch', 'PS5']
        }

        const mutation = `#graphql
          mutation updateGame($id: ID!, $edits: EditGameInput!) {
            updateGame(id: $id, edits: $edits) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          id: thisGameId,
          edits: thisEdits
        };

        graphqlMutation(mutation, variables).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('data');
          expect(response.body.data.updateGame).to.have.all.keys('id', 'title', 'platform');
          const updatedGame = response.body.data.updateGame;
          expect(updatedGame.title).to.equal(variables.edits.title);
          expect(updatedGame.platform).to.deep.equal(variables.edits.platform);
        });
      })

    })


    context ('Negative Tests', () => {
      it ('Handles non-existent game ID gracefully', () => {
        const nonExistentGameId = "7777"; // Assuming '7777' does not exist in the database
      
        const query = `#graphql
          query GetGame($id: ID!) {
            getGame(id: $id) {
              id
              title
              platform
            }
          }
        `;
        const variables = {
          id: nonExistentGameId
        };
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200); // Confirming that the server itself did not error out
          expect(response.body.data.getGame).to.be.null; // Expecting null for non-existent resources
          const expectedErrorMessage= `Game with ID ${nonExistentGameId} is not exist`;
          expect(response.body.errors[0].message).to.equal(expectedErrorMessage); // Confirming that the server returned the expected error message
          // expect(response.body.errors).to.be.undefined; // No GraphQL errors should be present
        });
      });
      it('Handles non-existent review ID gracefully', () => {
        const nonExistentReviewId = "9999"; // Assuming '9999' does not exist in the database
      
        const query = `#graphql
          query GetReview($id: ID!) {
            getReview(id: $id) {
              id
              rating
              content
            }
          }
        `;
        const variables = {
          id: nonExistentReviewId
        };
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200); // Confirming that the server itself did not error out
          expect(response.body.data.getReview).to.be.null; // Expecting null for non-existent resources
          const expectedErrorMessage= `Review with ID ${nonExistentReviewId} is not exist`;
          expect(response.body.errors[0].message).to.equal(expectedErrorMessage); // Confirming that the server returned the expected error message
          
        });
      })
      it('Handles non-existent author ID gracefully', () => {
        const nonExistentAuthorId = "9999"; // Assuming '9999' does not exist in the database
      
        const query = `#graphql
          query GetAuthor($id: ID!) {
            getAuthor(id: $id) {
              id
              name
              verified
            }
          }
        `;
        const variables = {
          id: nonExistentAuthorId
        };
        graphqlQuery(query, variables).then((response) => {
          expect(response.status).to.equal(200); // Confirming that the server itself did not error out
          expect(response.body.data.getAuthor).to.be.null; // Expecting null for non-existent resources
          const expectedErrorMessage= `Author with ID ${nonExistentAuthorId} is not exist`;
          expect(response.body.errors[0].message).to.equal(expectedErrorMessage); // Confirming that the server returned the expected error message
        });
      })
    })

    context('Integration Tests', () => {
      it ('add a game and verify its addition and deletion', () => {
          const newGameTitle = 'New Game333';
          const platforms = ['Switch', 'PS5']; // Use plural for arrays typically
  
          // ADD GAME
          const thisAddGameMutation = `#graphql
            mutation AddGame($game: AddGameInput!) {
              addGame(game: $game) {
                id
                title
                platform
              }
            }
          `;
          const thisAddGameVars = {
              game: {
                  title: newGameTitle,
                  platform: platforms
              }
          };
          graphqlMutation(thisAddGameMutation, thisAddGameVars).then((response) => {
              expect(response.status).to.equal(200);
              const createdGame = response.body.data.addGame;
              expect(createdGame.title).to.equal(newGameTitle);
              expect(createdGame.platform).to.deep.equal(platforms);
              cy.wrap(createdGame.id).as('createdGameId'); // Assumption: cy.wrap is used correctly (seems mixed with Cypress and non-Cypress code)
          });
  
          // CHECK THE GAME IS ADDED
          const thisAfterAddGameQuery = `#graphql
            query {
              allGames {
                id
                title
                platform
              }
            }
          `;
          graphqlQuery(thisAfterAddGameQuery).then((response) => {
              expect(response.status).to.equal(200);
              const gameFound = response.body.data.allGames.find((g) => g.title === newGameTitle);
              // in check adding game block
              expect(gameFound).to.exist;
          });
  
          // DELETE THE GAME
          cy.get('@createdGameId').then((createdGameId) => { 
              const thisDeleteMutation = `#graphql
                mutation DeleteGame($id: ID!) {
                  deleteGame(id: $id) {
                    id
                  }
                }
              `;
              const deleteVariables = { id: createdGameId };
              graphqlMutation(thisDeleteMutation, deleteVariables).then((response) => {
                  expect(response.status).to.equal(200);
                  const afterDeleteGameReturn = response.body.data.deleteGame;
                  const deletedGameExist = afterDeleteGameReturn.some((g) => g.id === createdGameId);
                  expect(deletedGameExist).to.be.false;
  
              });
          });


          // CHECK THE GAME IS DELETED
          const thisAfterDeleteGameQuery = `#graphql
            query {
              allGames {
                id
                title
                platform
              }
            }
          `;
          graphqlQuery(thisAfterDeleteGameQuery).then((response) => {
              expect(response.status).to.equal(200);
              const gameFound = response.body.data.allGames.find((g) => g.title === newGameTitle);

              // in check deleting game block
              expect(gameFound).to.not.exist;
          });

      });
  });
  

   
  
  });
  