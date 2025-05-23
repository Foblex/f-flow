describe('DragHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-handle');
  });

  it('should drag fNode element and update its transform translate', function() {

    cy.wait(500).get('.f-node.f-drag-handle').then(($dragHandle: JQuery<HTMLElement>) => {
      const dragHandleRect = $dragHandle.get(0).getBoundingClientRect();

      cy.get('.f-node.f-drag-handle')
        .first()
        .trigger('mousedown', { button: 0, force: true })
        .trigger('mousemove', { clientX: -150, clientY: 0 })
        .trigger('pointerup', { clientX: 0, clientY: 0 });

      cy.get('.f-node.f-drag-handle')
        .first().then(($dragHandle2: JQuery<HTMLElement>) => {
        const dragHandleRect2 = $dragHandle2.get(0).getBoundingClientRect();
        expect(Math.round(dragHandleRect.x + 150)).to.equal(Math.round(dragHandleRect2.x));
      })
    });
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


