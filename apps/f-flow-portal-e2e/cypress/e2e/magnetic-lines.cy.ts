describe('MagneticLines', () => {
  function getNodeRect(nodes: JQuery<HTMLElement>, label: string): DOMRect {
    const node = Array.from(nodes).find((item) => item.textContent?.includes(label));

    expect(node, `${label} node`).to.exist;

    if (!node) {
      throw new Error(`Missing node: ${label}`);
    }

    return node.getBoundingClientRect();
  }

  beforeEach(() => {
    cy.visit('/examples/magnetic-lines');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should show helper lines while dragging and hide after drop', () => {
    cy.get('.f-magnetic-lines .f-line').should('not.exist');

    cy.get('.f-node').then(($initialNodes: JQuery<HTMLElement>) => {
      const initialNode1Rect = getNodeRect($initialNodes, 'Node 1');

      cy.wait(150);

      cy.get('.f-node').then(($nodes: JQuery<HTMLElement>) => {
        const node1Rect = getNodeRect($nodes, 'Node 1');
        const node2Rect = getNodeRect($nodes, 'Node 2');

        expect(Math.abs(node1Rect.top - initialNode1Rect.top)).to.be.lessThan(2);
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
});
