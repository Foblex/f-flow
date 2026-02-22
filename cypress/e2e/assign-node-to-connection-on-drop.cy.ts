describe('AssignNodeToConnectionOnDrop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/assign-node-to-connection-on-drop');
    cy.get('f-flow').scrollIntoView();
  });

  it('should split existing connection when node intersects connection', () => {
    cy.get('.f-connection').should('have.length', 1);
    cy.get('[data-f-node-id="3"]').should('contain.text', 'Drag me to connection');

    cy.window().then((win) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const winAny = win as any;
      const host = win.document.querySelector('assign-node-to-connection-on-drop');
      expect(host).to.exist;
      expect(winAny.ng?.getComponent).to.be.a('function');
      const component = winAny.ng.getComponent(host);
      expect(component?.nodeIntersectedWithConnection).to.be.a('function');

      component.nodeIntersectedWithConnection({
        fNodeId: '3',
        fConnectionIds: ['1'],
      });
    });

    cy.get('.f-connection', { timeout: 6000 }).should('have.length', 2);
    cy.get('[data-f-node-id="3"]').should('contain.text', "I'm connected node");
  });
});
