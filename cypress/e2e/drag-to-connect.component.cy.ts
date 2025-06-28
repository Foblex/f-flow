describe('DragToConnectComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-connect');
    cy.get('f-flow').scrollIntoView();
  })

  it('should start creating a connection and show connection-for-create element', function () {
    cy.get('.f-node-output').then(($output) => {
      const outputRect = $output[0].getBoundingClientRect();
      const startX = outputRect.left + outputRect.width / 2;
      const startY = outputRect.top + outputRect.height / 2;

      cy.get('.f-connection-for-create').should('exist')
        .invoke('css', 'display').should('equal', 'none');

      cy.wrap($output)
        .trigger('mousedown', {button: 0, clientX: startX, clientY: startY, force: true})
        .trigger('mousemove', {clientX: startX + 100, clientY: startY + 100, force: true})
        .wait(500)
        .get('.f-connection-for-create').should('exist')
        .invoke('css', 'display').should('equal', 'block')
        .wrap($output)
        .trigger('pointerup');

      cy.wait(500).get('.f-connection-for-create').should('exist')
        .invoke('css', 'display').should('equal', 'none');
    });
  });

  it('should drag from output to input and create a connection', function () {
    cy.get('#f-connection-0').should('not.exist');

    cy.get('.f-node-output').then(($output) => {
      const outputRect = $output[0].getBoundingClientRect();
      const startX = outputRect.left + outputRect.width / 2;
      const startY = outputRect.top + outputRect.height / 2;

      cy.get('.f-node-input').then(($input) => {
        const inputRect = $input[0].getBoundingClientRect();
        const endY = inputRect.top + inputRect.height / 2;
        const endX = inputRect.left + inputRect.width / 2;

        cy.wrap($output)
          .trigger('mousedown', {button: 0, clientX: startX, clientY: startY, force: true})
          .trigger('mousemove', {clientX: endX, clientY: endY, force: true})
          .trigger('pointerup', {clientX: endX, clientY: endY, force: true});

        cy.get('#f-connection-0', {timeout: 2000}).should('exist');
      });
    });
  });
})



