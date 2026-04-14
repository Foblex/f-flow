describe('SchemaDesigner', () => {
  beforeEach(() => {
    cy.visit('/examples/schema-designer');
    cy.contains('h1', 'Schema Designer').should('be.visible');
  });

  it('renders the standalone schema designer preview iframe', () => {
    cy.get('iframe.reference-app-frame')
      .should('have.attr', 'title', 'Schema Designer')
      .and(($iframe) => {
        const src = $iframe.attr('src');

        expect(src, 'preview iframe src').to.exist;

        if (!src) {
          throw new Error('Missing schema designer preview src');
        }

        const url = new URL(src);
        expect(['127.0.0.1', 'localhost']).to.include(url.hostname);
        expect(url.port).to.equal('4301');
        expect(url.pathname).to.equal('/');
      });
  });

  it('documents schema designer capabilities on the example page', () => {
    cy.contains('This example shows how to build a schema editor on top of Foblex Flow.').should(
      'be.visible',
    );

    cy.contains('Change relation cardinality from the inline relation toolbar.').should('exist');

    cy.contains('a', 'apps/example-apps/schema-designer')
      .should('have.attr', 'href')
      .and('include', 'apps/example-apps/schema-designer');
  });
});
