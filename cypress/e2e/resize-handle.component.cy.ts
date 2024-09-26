describe('ResizeHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/resize-handle');
  });

  it('should drag fNode ResizeHandle and update node size', function() {

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'transform')
      .should('equal', 'matrix(1, 0, 0, 1, 0, 0)');

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'width')
      .should('equal', '120px');

    cy.get('div[data-f-node-id=\'f-node-0\'] div[data-f-resize-handle-type$=\'TOP\']')
      .trigger('mousedown', { button: 0, force: true })
      .trigger('mousemove', { clientX: 0, clientY: 0 })
      .trigger('mousemove', { clientX: -50, clientY: -50 })
      .trigger('mouseup');

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'transform')
      .should('equal', 'matrix(1, 0, 0, 1, -50, -50)');

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'width')
      .should('equal', '170px');
  });
});


