describe('DragStartEndEvents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/drag-start-end-events');
    cy.get('f-flow').scrollIntoView();
  });

  it('should append move-node and drag-ended events to log', () => {
    // Header (title input on FEventsPanelComponent — see node-selection example for the simpler 'Selection log' case).
    cy.get('f-events-panel').should('contain.text', 'Drag & connection events');

    cy.get('.f-node')
      .first()
      .then(($node: JQuery<HTMLElement>) => {
        const rect = $node[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.wrap($node)
          .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
          .trigger('mousemove', { clientX: startX + 6, clientY: startY + 6, force: true })
          .trigger('mousemove', { clientX: startX + 80, clientY: startY + 30, force: true })
          .trigger('pointerup', { clientX: startX + 80, clientY: startY + 30, force: true });
      });

    // The dragStarted log row shows `<fEventType> <data>` in its value column,
    // so 'move-node' (the legacy event type for node drag — DRAG_NODE_HANDLER_TYPE)
    // must appear somewhere in the panel text.
    cy.get('f-events-panel').should('contain.text', 'move-node');
    // The dragEnded log row uses 'dragEnded' as the event name in the new panel layout.
    cy.get('f-events-panel').should('contain.text', 'dragEnded');
  });
});
