describe('AddNodeFromPalette', () => {
  function dispatchMouseEvent(
    win: Cypress.AUTWindow,
    target: EventTarget,
    type: 'mousedown' | 'mousemove',
    clientX: number,
    clientY: number,
  ): void {
    target.dispatchEvent(
      new win.MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: win,
        button: 0,
        buttons: 1,
        clientX,
        clientY,
        screenX: clientX,
        screenY: clientY,
      }),
    );
  }

  function getDropElements(
    win: Cypress.AUTWindow,
    clientX: number,
    clientY: number,
  ): HTMLElement[] {
    return (win.document.elementsFromPoint(clientX, clientY) as HTMLElement[]).filter(
      (x) => !x.closest('.f-external-item') && !x.closest('.f-external-item-preview'),
    );
  }

  function getLargestVisibleElement(elements: JQuery<HTMLElement>): HTMLElement {
    return Array.from(elements).reduce((largest, current) => {
      const currentRect = current.getBoundingClientRect();
      const largestRect = largest.getBoundingClientRect();
      const currentArea = currentRect.width * currentRect.height;
      const largestArea = largestRect.width * largestRect.height;

      return currentArea > largestArea ? current : largest;
    });
  }

  function findValidDropPoint(win: Cypress.AUTWindow, flow: HTMLElement): { x: number; y: number } {
    const rect = flow.getBoundingClientRect();
    const padding = 24;
    const xCandidates = [
      rect.left + rect.width * 0.75,
      rect.left + rect.width * 0.5,
      rect.left + rect.width * 0.25,
      rect.left + padding,
      rect.right - padding,
    ];
    const yCandidates = [
      rect.top + rect.height * 0.5,
      rect.top + rect.height * 0.3,
      rect.top + rect.height * 0.7,
      rect.top + padding,
      rect.bottom - padding,
    ];

    for (const y of yCandidates) {
      for (const x of xCandidates) {
        const elements = getDropElements(win, x, y);

        if (elements[0]?.closest('f-flow')) {
          return { x, y };
        }
      }
    }

    throw new Error('Valid drop point inside f-flow was not found');
  }

  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/add-node-from-palette');
    cy.get('f-flow').scrollIntoView();
    cy.get('body', { timeout: 10000 }).should(($body: JQuery<HTMLElement>) => {
      expect($body.find('.f-loading-dot').length).to.equal(0);
    });
  });

  it('should create node when external item is dropped into canvas', () => {
    cy.get('.f-node').should('have.length', 2);

    cy.contains('.f-external-item', 'External item with data').then(
      ($item: JQuery<HTMLElement>) => {
        const itemRect = $item[0].getBoundingClientRect();
        const startX = itemRect.left + itemRect.width / 2;
        const startY = itemRect.top + itemRect.height / 2;

        cy.get('f-flow').then(($flows: JQuery<HTMLElement>) => {
          const flow = getLargestVisibleElement($flows);

          cy.window().then((win: Cypress.AUTWindow) => {
            const { x: dropX, y: dropY } = findValidDropPoint(win, flow);

            cy.window().then((win: Cypress.AUTWindow) => {
              dispatchMouseEvent(win, $item[0], 'mousedown', startX, startY);
              dispatchMouseEvent(win, win.document, 'mousemove', startX + 8, startY + 8);
            });

            cy.get('.f-external-item-preview').should('exist');
            cy.get('.f-external-item-placeholder').should('exist');

            cy.window().then((win: Cypress.AUTWindow) => {
              dispatchMouseEvent(win, win.document, 'mousemove', dropX, dropY);
            });

            cy.window().then((win: Cypress.AUTWindow) => {
              const elements = getDropElements(win, dropX, dropY);

              expect(elements.length).to.be.greaterThan(0);
              expect(elements[0].closest('f-flow')).to.not.equal(null);
            });

            cy.get('body').trigger('pointerup', {
              button: 0,
              buttons: 0,
              clientX: dropX,
              clientY: dropY,
              pointerType: 'mouse',
              force: true,
            });

            cy.get('.f-external-item-preview').should('not.exist');
          });
        });
      },
    );

    cy.get('.f-node', { timeout: 4000 }).should('have.length', 3);
    cy.contains('.f-node', 'Data 1').should('exist');
  });
});
