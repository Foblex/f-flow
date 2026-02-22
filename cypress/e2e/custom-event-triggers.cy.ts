describe('CustomEventTriggers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/custom-event-triggers');
    cy.get('f-flow').scrollIntoView();
  });

  it('should block node move when Shift key is not pressed', () => {
    cy.contains('.f-node', 'Node 1').invoke('css', 'transform').as('initialNode1Transform');

    cy.contains('.f-node', 'Node 1').then(($node: JQuery<HTMLElement>) => {
      const rect = $node[0].getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
        .trigger('mousemove', { clientX: startX + 120, clientY: startY + 30, force: true })
        .trigger('pointerup', { clientX: startX + 120, clientY: startY + 30, force: true });
    });

    cy.get('@initialNode1Transform').then((initialTransform) => {
      cy.contains('.f-node', 'Node 1')
        .invoke('css', 'transform')
        .should('equal', initialTransform.toString());
    });
  });
});
