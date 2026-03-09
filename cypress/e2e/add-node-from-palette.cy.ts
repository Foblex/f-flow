describe('AddNodeFromPalette', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/add-node-from-palette');
    cy.get('f-flow').scrollIntoView();
  });

  it('should create node when external item is dropped into canvas', () => {
    cy.get('.f-node').should('have.length', 2);

    cy.contains('.external-item', 'External item with data').then(($item: JQuery<HTMLElement>) => {
      const itemRect = $item[0].getBoundingClientRect();
      const startX = itemRect.left + itemRect.width / 2;
      const startY = itemRect.top + itemRect.height / 2;

      cy.get('f-flow').then(($flow: JQuery<HTMLElement>) => {
        const flowRect = $flow[0].getBoundingClientRect();
        const dropX = flowRect.left + flowRect.width / 2;
        const dropY = flowRect.top + flowRect.height / 2;

        cy.wrap($item)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: startX + 8, clientY: startY + 8, force: true });

        cy.get('body')
          .trigger('mousemove', { clientX: dropX, clientY: dropY, force: true })
          .trigger('pointerup', { clientX: dropX, clientY: dropY, force: true });
      });
    });

    cy.get('.f-node', { timeout: 4000 }).should('have.length', 3);
    cy.contains('.f-node', 'Data 1').should('exist');
  });
});
