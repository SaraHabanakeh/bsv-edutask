// GUI tests

let testUserId;

beforeEach(() => {
  // 1. Create test user
  cy.request({
    method: 'POST',
    url: 'http://localhost:5001/users/create',
    form: true,
    body: {
      firstName: 'sara',
      lastName: 'User',
      email: 'sara@user.com'
    }
  })
    // 2. Get user ID
    .then(() => {
      return cy.request('GET', `http://localhost:5001/users/bymail/${encodeURIComponent('sara@user.com')}`);
    })
    .then((response) => {
      testUserId = response.body._id.$oid;
      cy.log(`Created user ${testUserId}`);

      // 3. Create task
      return cy.request({
        method: 'POST',
        url: 'http://localhost:5001/tasks/create',
        form: true,
        body: {
          userid: testUserId,
          title: 'Make chili con carne',
          url: 'DCvIBlFmujY',
          description: 'Test task',
          todos: 'Watch video'
        }
      });
    })

    // 4. Visit app and login
    .then(() => {
      cy.visit('http://localhost:3000');
      cy.get('#email').type('sara@user.com');
      cy.get('input[type="submit"][value="Login"]').click({ force: true });
    });
});

afterEach(() => {
  const email = 'sara@user.com';

  return cy.request({
    method: 'GET',
    url: `http://localhost:5001/users/bymail/${email}`,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body._id?.$oid) {
      const userId = response.body._id.$oid;
      return cy.request('DELETE', `http://localhost:5001/users/${userId}`)
        .then(() => {
          cy.log(`Deleted user ${userId}`);
        });
    } else {
      cy.log('No test user found to delete.');
    }
  });
});

describe('R8UC1 – Create a new To-Do Item', () => {
  it('should create a new to-do item when title and URL inputs are not empty', () => {
    cy.get('#title').type('React in 100 seconds');
    cy.get('#url').type('Tn6-PIqc4UM');
    cy.get('input[type="submit"][value="Create new Task"]').click({ force: true });

    cy.contains('React in 100 seconds').should('exist');
  });

  it('should keep the Add button disabled when title input is empty', () => {
    cy.get('#url').type('miqNZlLyweM');
    cy.get('input[type="submit"][value="Create new Task"]').should('be.disabled');
  });
});


describe('R8UC2 – Toggle a To-Do Item', () => {
  it('should strike through an active to-do item', () => {
    cy.contains('Make chili con carne').click({ force: true });
    cy.get('.todo-list').should('exist');

    cy.contains('Watch video')
      .parent()
      .find('.checker')
      .click({ force: true });

    cy.contains('Watch video')
      .should('have.css', 'text-decoration')
      .and('include', 'line-through');
  });

  it('should toggle the to-do item back to active', () => {
    cy.contains('Make chili con carne').click({ force: true });
    cy.get('.todo-list').should('exist');

    cy.contains('Watch video')
      .parent()
      .find('.checker')
      .click({ force: true });

    cy.contains('Watch video')
      .parent()
      .find('.checker')
      .click({ force: true });

    cy.contains('Watch video')
      .should('have.css', 'text-decoration')
      .and('not.include', 'line-through');
  });
});

describe('R8UC3 - Delete a To-Do Item', () => {
  it('should remove the to-do item from the list', () => {
    cy.contains('Make chili con carne').click({ force: true });

    cy.contains('Watch video')
      .parent()
      .find('.remover')
      .click({ force: true });

    cy.contains('Watch video').should('not.exist');
  });
});

