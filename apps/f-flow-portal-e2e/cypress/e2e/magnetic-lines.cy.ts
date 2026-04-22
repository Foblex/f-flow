describe('MagneticLines', () => {
  function getNodeRect(nodes: JQuery<HTMLElement>, label: string): DOMRect {
    const node = Array.from(nodes).find((item) => item.textContent?.includes(label));

    expect(node, `${label} node`).to.exist;

    if (!node) {
      throw new Error(`Missing node: ${label}`);
    }

    return node.getBoundingClientRect();
  }

  function waitForStableNodePosition(
    label: string,
    previousTop?: number,
    attempts = 0,
  ): Cypress.Chainable<void> {
    return cy.get('.f-node').then(($nodes: JQuery<HTMLElement>) => {
      const rect = getNodeRect($nodes, label);
      const isStable = previousTop !== undefined && Math.abs(rect.top - previousTop) < 2;

      if (isStable) {
        return cy.wrap(undefined, { log: false });
      }

      if (attempts >= 20) {
        throw new Error(`Node did not stabilize: ${label}`);
      }

      return cy
        .wait(100, { log: false })
        .then(() => waitForStableNodePosition(label, rect.top, attempts + 1));
    });
  }

  beforeEach(() => {
    cy.visit('/examples/magnetic-lines');
    cy.get('f-flow').scrollIntoView();
    waitForStableNodePosition('Node 1');
  });

  it('should show helper lines while dragging and hide after drop', () => {
    cy.get('.f-magnetic-lines .f-line').should('not.exist');

    cy.get('.f-node').then(($nodes: JQuery<HTMLElement>) => {
      const node1Rect = getNodeRect($nodes, 'Node 1');
      const node2Rect = getNodeRect($nodes, 'Node 2');

      const startX = node2Rect.left + node2Rect.width / 2;
      const startY = node2Rect.top + node2Rect.height / 2;
      const dragX = startX;
      const dragY = node1Rect.top + node2Rect.height / 2 + 8;

      cy.contains('.f-node', 'Node 2').trigger('mousedown', {
        button: 0,
        clientX: startX,
        clientY: startY,
        force: true,
      });

      cy.get('body')
        .trigger('mousemove', {
          clientX: startX + 2,
          clientY: startY + 2,
          force: true,
        })
        .trigger('mousemove', {
          clientX: dragX,
          clientY: dragY,
          force: true,
        });

      cy.get('.f-magnetic-lines .f-line', { timeout: 2000 }).should(
        ($lines: JQuery<HTMLElement>) => {
          expect($lines).to.have.length(2);
          const visibleCount = Array.from($lines).filter(
            (line) => getComputedStyle(line).display !== 'none',
          ).length;
          expect(visibleCount).to.be.greaterThan(0);
        },
      );

      cy.get('body').trigger('pointerup', {
        clientX: dragX,
        clientY: dragY,
        force: true,
      });

      cy.get('.f-node', { timeout: 2000 }).should(($updatedNodes: JQuery<HTMLElement>) => {
        const node1AfterRect = getNodeRect($updatedNodes, 'Node 1');
        const node2AfterRect = getNodeRect($updatedNodes, 'Node 2');

        expect(Math.abs(node2AfterRect.top - node1AfterRect.top)).to.be.lessThan(4);
      });

      cy.get('.f-magnetic-lines .f-line', { timeout: 2000 }).should(
        ($lines: JQuery<HTMLElement>) => {
          const visibleCount = Array.from($lines).filter(
            (line) => getComputedStyle(line).display !== 'none',
          ).length;
          expect(visibleCount).to.equal(0);
        },
      );
    });
  });
});
