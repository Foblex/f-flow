// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function getTranslate(transform: string): { x: number; y: number } {
  const match = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*([^)]+)\)/.exec(transform);

  if (!match) {
    return { x: 0, y: 0 };
  }

  return {
    x: Number.parseFloat(match[1]),
    y: Number.parseFloat(match[2]),
  };
}

describe('GridSystem', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/grid-system');
    cy.get('f-flow').scrollIntoView();
  });

  it('should snap dragged node to 32px grid', () => {
    let before = { x: 0, y: 0 };

    cy.get('.f-node.f-drag-handle')
      .first()
      .then(($node: JQuery<HTMLElement>) => {
        before = getTranslate($node.css('transform'));

        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: startX + 8, clientY: startY + 8, force: true })
          .trigger('mousemove', { clientX: startX + 97, clientY: startY + 97, force: true })
          .trigger('pointerup', {
            clientX: startX + 97,
            clientY: startY + 97,
            force: true,
          });
      });

    cy.get('.f-node.f-drag-handle')
      .first()
      .invoke('css', 'transform')
      .then((afterTransform) => {
        const after = getTranslate(afterTransform.toString());

        expect(after.x % 32).to.equal(0);
        expect(after.y % 32).to.equal(0);
        expect(after.x).to.be.greaterThan(before.x);
        expect(after.y).to.be.greaterThan(before.y);
      });
  });
});
