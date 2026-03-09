describe('MagneticLines', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/magnetic-lines');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should show helper lines while dragging and hide after drop', () => {
    cy.get('.f-magnetic-lines .f-line').should('not.exist');

    cy.contains('.f-node', 'Node 1').then(($node1: JQuery<HTMLElement>) => {
      const node1Rect = $node1[0].getBoundingClientRect();

      cy.contains('.f-node', 'Node 2').then(($node2: JQuery<HTMLElement>) => {
        const node2Rect = $node2[0].getBoundingClientRect();
        const startX = node2Rect.left + node2Rect.width / 2;
        const startY = node2Rect.top + node2Rect.height / 2;
        const dragX = startX;
        const dragY = node1Rect.top + node2Rect.height / 2 + 8;

        cy.wrap($node2).trigger('mousedown', {
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

        cy.wait(120);

        cy.get('.f-magnetic-lines .f-line')
          .should('have.length', 2)
          .then(($lines: JQuery<HTMLElement>) => {
            const visibleCount = Array.from($lines).filter(
              (line) => getComputedStyle(line).display !== 'none',
            ).length;
            expect(visibleCount).to.be.greaterThan(0);
          });

        cy.get('body').trigger('pointerup', {
          clientX: dragX,
          clientY: dragY,
          force: true,
        });

        cy.wait(120);

        cy.contains('.f-node', 'Node 2').then(($node2After: JQuery<HTMLElement>) => {
          const node2AfterRect = $node2After[0].getBoundingClientRect();
          expect(Math.abs(node2AfterRect.top - node1Rect.top)).to.be.lessThan(2);
        });

        cy.get('.f-magnetic-lines .f-line').each(($line) => {
          expect(getComputedStyle($line[0]).display).to.equal('none');
        });
      });
    });
  });
});
