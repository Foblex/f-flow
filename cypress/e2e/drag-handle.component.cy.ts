describe('DragHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-handle');
  });

  it('should drag fNode element and update its transform translate', function() {

    cy.get('.f-node.f-drag-handle').invoke('css', 'transform')
      .should('equal', 'matrix(1, 0, 0, 1, 0, 0)');

    cy.get('.f-node.f-drag-handle')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: -150, clientY: 0 })
      .trigger('mouseup', { clientX: 0, clientY: 0 });

    cy.get('.f-node.f-drag-handle').invoke('css', 'transform')
      .should('equal', 'matrix(1, 0, 0, 1, 150, 0)');
  });

  it('should click fNode element and update its selection state', function() {

    cy.get('.f-node.f-drag-handle')
      .should('not.have.class', 'f-selected');

    cy.get('.f-node.f-drag-handle').click();

    cy.get('.f-node.f-drag-handle').should('have.class', 'f-selected');
  });

  it('should drag fCanvas element and update its transform translate', function () {
    cy.get('.f-canvas').invoke('css', 'transform').then((transform) => {

      cy.get('#f-flow-0')
        .trigger('mousedown', { clientX: 10, clientY: 10, button: 0, force: true })
        .trigger('mousemove', { clientX: 0, clientY: 0 })
        .trigger('mousemove', { clientX: 20, clientY: 0 })
        .trigger('mouseup', { clientX: 30, clientY: 0 });

      cy.get('.f-canvas').invoke('css', 'transform')
        .should('not.equal', transform);
    });

  });
});


