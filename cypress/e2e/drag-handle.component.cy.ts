describe('DragHandleComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-handle');
    cy.get('f-flow').scrollIntoView();
  });

  it('should drag fNode element and update its transform translate', function () {

    cy.wait(500).get('.f-node.f-drag-handle').then(($dragHandle: JQuery<HTMLElement>) => {
      const dragHandleRect = $dragHandle.get(0).getBoundingClientRect();

      cy.get('.f-node.f-drag-handle')
        .first()
        .trigger('mousedown', {button: 0, force: true})
        .trigger('mousemove', {clientX: -250, clientY: 0})
        .trigger('pointerup', {clientX: 0, clientY: 0});

      cy.wait(1500).get('.f-node.f-drag-handle')
        .first().then(($dragHandle2: JQuery<HTMLElement>) => {
        const dragHandleRect2 = $dragHandle2.get(0).getBoundingClientRect();
        expect(Math.round(dragHandleRect.x + 250)).to.equal(Math.round(dragHandleRect2.x));
      })
    });
  });

  it('should click fNode element and update its selection state', function () {
    cy.wait(500).get('.f-node.f-drag-handle')
      .should('not.have.class', 'f-selected');

    cy.wait(500).get('.f-node.f-drag-handle').click();

    cy.wait(500).get('.f-node.f-drag-handle').should('have.class', 'f-selected');
  });

  it('should drag fCanvas element and update its transform translate', function () {
    cy.get('f-flow').first().then(($flow) => {
      cy.get('f-canvas').first().then(($canvas) => {
        const transform = $canvas.css('transform');

        cy.wrap($flow)
          .trigger('mousedown', {clientX: 10, clientY: 10, button: 0, force: true})
          .trigger('mousemove', {clientX: 0, clientY: 0})
          .trigger('mousemove', {clientX: 20, clientY: 20})
          .trigger('pointerup', {clientX: 30, clientY: 30, force: true});

        cy.wrap($canvas).invoke('css', 'transform')
          .should('not.equal', transform);
      });
    });
  });
});


