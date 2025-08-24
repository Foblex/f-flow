import {wrap} from "node:module";

describe('GridSystemComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/grid-system');
    cy.get('f-flow').scrollIntoView();
    cy.wait(500);
  });

  function getNodePosition($node: JQuery<HTMLElement>) {
    const transform = $node.css('transform');
    const match = /matrix\([^,]+,[^,]+,[^,]+,[^,]+, ([^,]+), ([^)]+)\)/.exec(transform);
    return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
  }

  it('should move node in 32px grid increments by default', () => {
    cy.get('.f-node.f-drag-handle').first().then(($node) => {
      const before = getNodePosition($node);
      const rect = $node[0].getBoundingClientRect();
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', { clientX: fromX, clientY: fromY, button: 0, force: true })
        .trigger('mousemove', { clientX: fromX + 10, clientY: fromY + 10, force: true })
        .trigger('mousemove', { clientX: fromX + 97, clientY: fromY + 97, force: true })
        .wait(500)
        .trigger('pointerup', { clientX: fromX + 97, clientY: fromY + 97, force: true });



      cy.wrap($node).wait(500).then(($nodeResult) => {
        const after = getNodePosition($node);
        cy.log(JSON.stringify(after));

        expect(after.x % 32).to.equal(0);
        expect(after.y % 32).to.equal(0);
        expect(after.x).to.be.greaterThan(before.x);
        expect(after.y).to.be.greaterThan(before.y);
      });
    });
  });

  it('should toggle cell adjustment and still snap to grid', () => {
    cy.get('f-checkbox').click(); // Включить adjustCellSizeWhileDragging = true

    cy.get('.f-node.f-drag-handle').first().then(($node) => {
      const before = getNodePosition($node);
      const rect = $node[0].getBoundingClientRect();
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;

      cy.log(JSON.stringify(before));

      cy.wrap($node)
        .trigger('mousedown', { clientX: fromX, clientY: fromY, button: 0, force: true })
        .trigger('mousemove', { clientX: fromX + 10, clientY: fromY + 10, force: true })
        .trigger('mousemove', { clientX: fromX + 97, clientY: fromY + 97, force: true })
        .wait(500)
        .trigger('pointerup', { clientX: fromX + 97, clientY: fromY + 97, force: true });



      cy.wrap($node).wait(500).then(($nodeResult) => {
        const after = getNodePosition($node);
        cy.log(JSON.stringify(after));

        expect(after.x % 32).to.equal(0);
        expect(after.y % 32).to.equal(0);
        expect(after.x).to.be.greaterThan(before.x);
        expect(after.y).to.be.greaterThan(before.y);
      });
    });
  });
});
