describe('DragToGroup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-to-group');
    cy.get('f-flow').scrollIntoView();
  });

  it('should assign dragged node to target group', () => {
    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node: JQuery<HTMLElement>) => {
        const nodeRect = $node[0].getBoundingClientRect();
        const fromX = nodeRect.left + nodeRect.width / 2;
        const fromY = nodeRect.top + nodeRect.height / 2;

        cy.get('.f-group.f-drag-handle')
          .first()
          .then(($group: JQuery<HTMLElement>) => {
            const groupRect = $group[0].getBoundingClientRect();
            const toX = groupRect.left + groupRect.width / 2;
            const toY = groupRect.top + groupRect.height / 2;

            cy.wrap($node)
              .trigger('mousedown', { button: 0, clientX: fromX, clientY: fromY, force: true })
              .trigger('mousemove', { clientX: fromX + 10, clientY: fromY + 10, force: true })
              .trigger('mousemove', { clientX: toX, clientY: toY, force: true })
              .wait(500)
              .trigger('pointerup', { clientX: toX, clientY: toY, force: true });

            cy.wrap($node).invoke('attr', 'ng-reflect-f-parent-id').should('equal', 'g1');
          });
      });
  });
});
