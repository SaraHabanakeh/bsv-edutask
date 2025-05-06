beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('#email').type('test@user.com');
    cy.get('input[type="submit"][value="Login"]').click();
  });
  
  describe('R8UC1 – Create a new To-Do Item', () => {

    it('should create a new to-do item when title and URL inputs are not empty', () => {
      cy.get('#title').type('Make chili con carne');
      cy.get('#url').type('DCvIBlFmujY');
      cy.get('input[type="submit"][value="Create new Task"]').click();
  
      cy.contains('Make chili con carne').should('exist');
    });
  
    it('should keep the Add button disabled when title input is empty', () => {
      cy.get('#url').type('miqNZlLyweM');
      cy.get('input[type="submit"][value="Create new Task"]').should('be.disabled');
    });
  });
  
  describe('R8UC2 – Toggle a To-Do Item', () => {

    it('should strike through an active to-do item', () => {

      cy.contains('Makeup Tutorial').click();
      cy.get('.todo-list').should('exist');
  
      cy.contains('Watch video')
        .parent()
        .find('.checker')
        .click();
  
      cy.contains('Watch video')
        .parent()
        .find('.checker')
        .should('have.class', 'checked');
    });
  
    it('should toggle the to-do item back to active', () => {
      cy.contains('Makeup Tutorial').click();
      cy.get('.todo-list').should('exist');
  
      cy.contains('Watch video')
        .parent()
        .find('.checker')
        .click();
  
      cy.contains('Watch video')
        .parent()
        .find('.checker')
        .should('have.class', 'unchecked');
    });
  });

    describe('R8UC3 - Delete a To-Do Item', () => {
        it('should remove the to-do item from the list', () => {
            cy.contains('Makeup Tutorial').click();
            cy.contains('Watch video')
            .parent()
            .find('.remover')
            .click();

            cy.contains('Watch video').should('not.exist');

        });
    });
