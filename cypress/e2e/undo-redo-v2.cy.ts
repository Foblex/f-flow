function getTranslate(transform: string): { x: number; y: number } {
  const match = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*([^)]+)\)/.exec(transform);

  if (!match) {
    return { x: 0, y: 0 };
  }

  return { x: Number.parseFloat(match[1]), y: Number.parseFloat(match[2]) };
}

describe('UndoRedoV2', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/undo-redo-v2');
    cy.get('f-flow').scrollIntoView();
  });

  it('should restore node position with undo and move it again with redo', () => {
    cy.contains('.f-button', 'Undo').should('be.disabled');

    let initialTransform = '';

    cy.get('[data-f-node-id="node1"]')
      .invoke('css', 'transform')
      .then((value) => {
        initialTransform = value.toString();
      });

    cy.get('[data-f-node-id="node1"]').then(($node: JQuery<HTMLElement>) => {
      const rect = $node[0].getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
        .trigger('mousemove', { clientX: startX + 5, clientY: startY + 5, force: true })
        .trigger('mousemove', { clientX: startX + 120, clientY: startY + 35, force: true })
        .trigger('pointerup', { clientX: startX + 120, clientY: startY + 35, force: true });
    });

    cy.contains('.f-button', 'Undo').should('not.be.disabled').click({ force: true });

    cy.get('[data-f-node-id="node1"]')
      .invoke('css', 'transform')
      .then((afterUndoTransform) => {
        const after = getTranslate(afterUndoTransform.toString());
        const initial = getTranslate(initialTransform);

        expect(Math.abs(after.x - initial.x)).to.be.lessThan(2);
        expect(Math.abs(after.y - initial.y)).to.be.lessThan(2);
      });

    cy.contains('.f-button', 'Redo').should('not.be.disabled').click({ force: true });

    cy.get('[data-f-node-id="node1"]')
      .invoke('css', 'transform')
      .then((afterRedoTransform) => {
        const after = getTranslate(afterRedoTransform.toString());
        const initial = getTranslate(initialTransform);

        expect(Math.abs(after.x - initial.x)).to.be.greaterThan(10);
        expect(Math.abs(after.y - initial.y)).to.be.greaterThan(10);
      });
  });
});
