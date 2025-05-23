describe('DragToConnectComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-connect')
  })

  it('should start creating a connection and show connection-for-create element', function () {
    cy.get('f-flow').scrollIntoView();
    cy.get('.f-connection-for-create').should('exist')
      .invoke('css', 'display').should('equal', 'none');

    cy.get('.f-node-output')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: 0, clientY: 0 })
      .trigger('mousemove', { clientX: 140, clientY: 10 })
      .get('.f-connection-for-create').should('exist')
      .invoke('css', 'display').should('equal', 'block')
      .get('.f-node-output')
      .trigger('pointerup');

    cy.get('.f-connection-for-create').should('exist')
      .invoke('css', 'display').should('equal', 'none');
  });

  it('should drag from output to input and create a connection', function () {
    cy.get('f-flow').scrollIntoView();

    cy.get('#f-connection-0').should('not.exist');

    cy.get('.f-node-output')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: 0, clientY: 0 })
      .trigger('mousemove', { clientX: 140, clientY: 10 })
      .get('.f-node-input')
      .trigger('mousemove', { clientX: 140, clientY: 10 })
      .trigger('pointerup');

    cy.get('#f-connection-0').should('exist');
  });
})



