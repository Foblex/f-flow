describe('SchemaDesigner', () => {
  function openColumnMenu(columnId: string): void {
    cy.get(`[data-column-id="${columnId}"]`)
      .should('exist')
      .first()
      .then(($row: JQuery<HTMLElement>) => {
        const rect = $row[0].getBoundingClientRect();

        cy.wrap($row).trigger('contextmenu', {
          button: 2,
          buttons: 2,
          force: true,
          clientX: rect.left + 8,
          clientY: rect.top + 8,
        });
      });
  }

  function selectFirstConnection(): void {
    cy.get('.f-connection .badge')
      .should('exist')
      .first()
      .click({ force: true });
  }

  beforeEach(() => {
    cy.visit('/');
    cy.get('f-flow').scrollIntoView();
    cy.wait(300);
  });

  it('changes column key from unique to primary', () => {
    openColumnMenu('customer_email');

    cy.contains('.cdk-menu-item', 'Key').click({ force: true });
    cy.contains('.cdk-menu-item', 'Primary Key').click({ force: true });

    cy.get('[data-column-id="customer_email"]')
      .find('.key-primary')
      .should('exist');
  });

  it('deletes a single column instead of deleting the whole table', () => {
    cy.contains('.table-name', 'Customers').should('exist');
    cy.get('[data-column-id="customer_email"]').should('exist');

    openColumnMenu('customer_email');
    cy.contains('.cdk-menu-item', 'Delete Column').click({ force: true });

    cy.contains('.table-name', 'Customers').should('exist');
    cy.get('[data-column-id="customer_email"]').should('not.exist');
  });

  it('closes only the key submenu when hovering another root action', () => {
    openColumnMenu('customer_email');

    cy.contains('.menu-item--submenu', 'Key').trigger('mouseenter');
    cy.contains('.menu-panel--submenu', 'Primary Key').should('exist');

    cy.contains('.cdk-menu-item', 'Create Column').trigger('mouseenter');

    cy.contains('.cdk-menu-item', 'Create Column').should('exist');
    cy.get('.menu-panel').should('have.length.at.least', 1);
    cy.contains('.menu-panel--submenu', 'Primary Key').should('not.exist');
  });

  it('clears flow selection after changing relation type', () => {
    selectFirstConnection();

    cy.get('.f-connection.f-selected').should('exist');
    cy.get('.actions').should('be.visible');

    cy.contains('.actions .icon-btn', '1:N').click({ force: true });

    cy.get('.f-connection.f-selected').should('not.exist');
    cy.get('.actions:visible').should('have.length', 0);
    cy.get('.badge:visible').should('have.length.at.least', 1);
  });
});
