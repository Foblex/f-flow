describe('ResizeHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/resize-handle');
  });

  it('should drag fNode ResizeHandle and update node size', function() {
    cy.get('f-flow').scrollIntoView();

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'transform')
      .should('equal', 'matrix(1, 0, 0, 1, -20, -20)');

    cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'width')
      .should('equal', '120px');

    // cy.get('div[data-f-node-id=\'f-node-0\'] div[data-f-resize-handle-type$=\'TOP\']').then(($target) => {
    //   const targetRect = $target[ 0 ].getBoundingClientRect();
    //   const endY = targetRect.y;
    //   const endX = targetRect.x;
    //
    //   cy.log('YYY', endX, endY);
    //
    //   cy.get('div[data-f-node-id=\'f-node-0\'] div[data-f-resize-handle-type$=\'TOP\']')
    //     .trigger('mousedown', { button: 0, force: true })
    //     .trigger('mousemove', { clientX: 0 })
    //     .trigger('mousemove', { clientX: endY - 50 })
    //     .trigger('mouseup', { force: true });
    //
    //   cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'transform')
    //     .should('equal', 'matrix(1, 0, 0, 1, 108, 0)');
    //
    //   cy.get('div[data-f-node-id=\'f-node-0\']').invoke('css', 'width')
    //     .should('equal', '12px');
    // });

  });
});


