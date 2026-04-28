describe('ElkLayout', () => {
  function getSelect(label: string) {
    return cy.contains('.label', label).closest('f-select').find('select');
  }

  function getNodePosition(document: Document, label: string) {
    const element = Array.from(document.querySelectorAll<HTMLElement>('.f-node')).find((node) => {
      return node.textContent?.trim() === label;
    });
    const style = element?.getAttribute('style') ?? '';
    const match = style.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);

    expect(match, `translate transform for ${label}`).to.not.equal(null);

    return {
      x: Number(match![1]),
      y: Number(match![2]),
    };
  }

  function expectNodeDirection(sourceLabel: string, targetLabel: string, direction: string) {
    cy.document().should((document) => {
      const source = getNodePosition(document, sourceLabel);
      const target = getNodePosition(document, targetLabel);

      switch (direction) {
        case 'TOP_BOTTOM':
          expect(target.y).to.be.greaterThan(source.y);
          break;
        case 'BOTTOM_TOP':
          expect(target.y).to.be.lessThan(source.y);
          break;
        case 'LEFT_RIGHT':
          expect(target.x).to.be.greaterThan(source.x);
          break;
        case 'RIGHT_LEFT':
          expect(target.x).to.be.lessThan(source.x);
          break;
        default:
          throw new Error(`Unsupported direction: ${direction}`);
      }
    });
  }

  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/elkjs-layout');
    cy.get('f-flow').scrollIntoView();
  });

  it('should relayout across all directions', () => {
    cy.get('.f-node', { timeout: 15000 }).should('have.length', 10);
    getSelect('Direction').find('option').should('have.length', 4);
    expectNodeDirection('Node1', 'Node2', 'TOP_BOTTOM');

    getSelect('Direction').select('BOTTOM_TOP');
    expectNodeDirection('Node1', 'Node2', 'BOTTOM_TOP');

    getSelect('Direction').select('LEFT_RIGHT');
    expectNodeDirection('Node1', 'Node2', 'LEFT_RIGHT');

    getSelect('Direction').select('RIGHT_LEFT');
    expectNodeDirection('Node1', 'Node2', 'RIGHT_LEFT');

    getSelect('Direction').select('TOP_BOTTOM');
    expectNodeDirection('Node1', 'Node2', 'TOP_BOTTOM');
  });

  it('should relayout after algorithm and spacing changes', () => {
    cy.get('.f-node', { timeout: 15000 }).should('have.length', 10);
    getSelect('Algorithm').find('option').should('have.length', 12);
    getSelect('Algorithm').select('mrtree');
    getSelect('Spacing').select('SPACIOUS');

    cy.contains('.f-button', 'Add Node').click({ force: true });

    cy.get('.f-node', { timeout: 15000 }).should('have.length', 11);
    cy.contains('.f-node', 'Node11')
      .should('have.attr', 'style')
      .and('not.contain', 'translate(0px,0px)');
  });
});
