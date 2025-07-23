describe('LockDraggingComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/node-selection');
    cy.get('f-flow').scrollIntoView();
    cy.wait(500);
  });

  it('should select a single node via synthetic mouse interaction and emit selection event', () => {
    cy.get('.f-node.f-drag-handle', {timeout: 2000}).first().then(($node: JQuery<HTMLElement>) => {
      const rect = $node[0].getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', {clientX: centerX, clientY: centerY, button: 0, force: true})
        .trigger('mousemove', {clientX: centerX, clientY: centerY, force: true}) // обязательно
        .trigger('pointerup', {clientX: centerX, clientY: centerY, force: true});

      cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 1);
      cy.get('.overlay').invoke('text').should('include', 'Selection changed: f-node-0');
    });
  });

  it('should ignore selection on node with selection disabled', () => {
    cy.get('.f-node.f-drag-handle').contains('Disabled selection').then(($node: JQuery<HTMLElement>) => {
      const rect = $node[0].getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', {clientX: centerX, clientY: centerY, button: 0, force: true})
        .trigger('mousemove', {clientX: centerX + 1, clientY: centerY + 1, force: true}) // micro move
        .trigger('pointerup', {clientX: centerX + 1, clientY: centerY + 1, force: true});

      cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 0);
      cy.get('.overlay').invoke('text').should('not.contain', 'input2');
    });
  });

  it('should sequentially select all nodes and log correct selection events', () => {
    const expectedLogs = [
      'Selection changed: f-node-0',
      'Selection changed: f-node-1',
      'Selection changed:',
    ];

    cy.get('.f-node.f-drag-handle').each(($node) => {
      const rect = $node[0].getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      cy.wrap($node)
        .trigger('mousedown', {clientX: centerX, clientY: centerY, button: 0, force: true})
        .trigger('mousemove', {clientX: centerX + 1, clientY: centerY + 1, force: true})
        .trigger('pointerup', {clientX: centerX + 1, clientY: centerY + 1, force: true});

      cy.wait(100);
    });

    cy.get('.overlay div')
      .filter(':contains("Selection changed")')
      .should('have.length', 3)
      .then(($items) => {
        const logs = Cypress._.map($items, (el) => el.textContent?.trim());
        expect(logs).to.deep.equal(expectedLogs);
      });
  });

  // it('should select multiple nodes using metaKey (cmd/ctrl)', () => {
  //
  //   cy.get('.f-node.f-drag-handle').each(($node) => {
  //     const rect = $node[0].getBoundingClientRect();
  //     const centerX = rect.left + rect.width / 2;
  //     const centerY = rect.top + rect.height / 2;
  //
  //     cy.wrap($node)
  //       .trigger('mousedown', {clientX: centerX, clientY: centerY, button: 0, metaKey: true, force: true})
  //       .trigger('mousemove', {clientX: centerX + 1, clientY: centerY + 1, metaKey: true, force: true})
  //       .trigger('pointerup', {clientX: centerX + 1, clientY: centerY + 1, metaKey: true, force: true});
  //
  //     cy.wait(100);
  //   });
  //
  //   cy.get('.f-node.f-drag-handle.f-selected').should('have.length', 2);
  //
  //   cy.get('.overlay div')
  //     .last()
  //     .invoke('text')
  //     .should('match', /Selection changed: (f-node-[01],\s?){1}f-node-[01]/);
  // });
});
