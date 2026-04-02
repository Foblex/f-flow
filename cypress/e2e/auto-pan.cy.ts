describe('AutoPan', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/auto-pan');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should create a connection to an off-screen input', () => {
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 1);

    cy.get('[data-f-output-id="create-source-output"]').then(($output: JQuery<HTMLElement>) => {
      const outputRect = $output[0].getBoundingClientRect();
      const startX = outputRect.left + outputRect.width / 2;
      const startY = outputRect.top + outputRect.height / 2;

      cy.get('f-flow')
        .then(($flow: JQuery<HTMLElement>) => {
          const flowRect = $flow[0].getBoundingClientRect();
          const edgeX = flowRect.right - 8;

          cy.wrap($output).trigger('mousedown', {
            button: 0,
            clientX: startX,
            clientY: startY,
            force: true,
          });

          cy.get('body')
            .trigger('mousemove', {
              clientX: startX + 6,
              clientY: startY + 6,
              force: true,
            })
            .trigger('mousemove', {
              clientX: edgeX,
              clientY: startY,
              force: true,
            });

          cy.wait(1200);
        })
        .then(() => {
          cy.get('[data-f-input-id="offscreen-target-input"]').then(
            ($input: JQuery<HTMLElement>) => {
              const inputRect = $input[0].getBoundingClientRect();
              const endX = inputRect.left + inputRect.width / 2;
              const endY = inputRect.top + inputRect.height / 2;

              cy.get('body')
                .trigger('mousemove', {
                  clientX: endX,
                  clientY: endY,
                  force: true,
                })
                .trigger('pointerup', {
                  clientX: endX,
                  clientY: endY,
                  force: true,
                });
            },
          );
        });
    });

    cy.get('.f-connection:not(.f-connection-for-create)', { timeout: 3000 }).should(
      'have.length',
      2,
    );
    cy.get('[data-f-input-id="offscreen-target-input"]').should(
      'have.class',
      'f-node-input-connected',
    );
  });

  it('should reassign the existing connection to an off-screen input', () => {
    cy.get('[data-f-input-id="visible-target-input"]').should(
      'have.class',
      'f-node-input-connected',
    );
    cy.get('[data-f-input-id="offscreen-target-input"]').should(
      'not.have.class',
      'f-node-input-connected',
    );

    cy.get('.f-connection-drag-handle').then(($handles: JQuery<HTMLElement>) => {
      const handle = [...$handles].sort((left, right) => {
        return left.getBoundingClientRect().x - right.getBoundingClientRect().x;
      })[$handles.length - 1];

      if (!handle) {
        throw new Error('Expected at least one connection drag handle');
      }

      const handleRect = handle.getBoundingClientRect();
      const startX = handleRect.left + handleRect.width / 2;
      const startY = handleRect.top + handleRect.height / 2;

      cy.get('f-flow')
        .then(($flow: JQuery<HTMLElement>) => {
          const flowRect = $flow[0].getBoundingClientRect();
          const edgeX = flowRect.right - 8;

          cy.wrap(handle).trigger('mousedown', {
            button: 0,
            clientX: startX,
            clientY: startY,
            force: true,
          });

          cy.get('body')
            .trigger('mousemove', {
              clientX: startX + 6,
              clientY: startY + 6,
              force: true,
            })
            .trigger('mousemove', {
              clientX: edgeX,
              clientY: startY,
              force: true,
            });

          cy.wait(1200);
        })
        .then(() => {
          cy.get('[data-f-input-id="offscreen-target-input"]').then(
            ($input: JQuery<HTMLElement>) => {
              const inputRect = $input[0].getBoundingClientRect();
              const endX = inputRect.left + inputRect.width / 2;
              const endY = inputRect.top + inputRect.height / 2;

              cy.get('body')
                .trigger('mousemove', {
                  clientX: endX,
                  clientY: endY,
                  force: true,
                })
                .trigger('pointerup', {
                  clientX: endX,
                  clientY: endY,
                  force: true,
                });
            },
          );
        });
    });

    cy.get('[data-f-input-id="visible-target-input"]', { timeout: 3000 }).should(
      'not.have.class',
      'f-node-input-connected',
    );
    cy.get('[data-f-input-id="offscreen-target-input"]').should(
      'have.class',
      'f-node-input-connected',
    );
    cy.get('.f-connection:not(.f-connection-for-create)').should('have.length', 1);
  });

  it('should drag a node while auto-panning', () => {
    cy.get('[data-f-node-id="movable-node"]')
      .invoke('attr', 'style')
      .then((initialNodeStyle) => {
        cy.get('f-canvas')
          .invoke('css', 'transform')
          .then((initialTransform) => {
            cy.get('[data-f-node-id="movable-node"]').then(($node: JQuery<HTMLElement>) => {
              const nodeRect = $node[0].getBoundingClientRect();
              const startX = nodeRect.left + nodeRect.width / 2;
              const startY = nodeRect.top + nodeRect.height / 2;

              cy.get('f-flow').then(($flow: JQuery<HTMLElement>) => {
                const flowRect = $flow[0].getBoundingClientRect();
                const edgeX = flowRect.right - 8;

                cy.wrap($node).trigger('mousedown', {
                  button: 0,
                  clientX: startX,
                  clientY: startY,
                  force: true,
                });

                cy.get('body')
                  .trigger('mousemove', {
                    clientX: startX + 8,
                    clientY: startY + 8,
                    force: true,
                  })
                  .trigger('mousemove', {
                    clientX: edgeX,
                    clientY: startY,
                    force: true,
                  });

                cy.wait(1000);

                cy.get('body').trigger('pointerup', {
                  clientX: edgeX,
                  clientY: startY,
                  button: 0,
                  force: true,
                });
              });
            });

            cy.get('f-canvas').invoke('css', 'transform').should('not.equal', initialTransform);
            cy.get('[data-f-node-id="movable-node"]')
              .invoke('attr', 'style')
              .should('not.equal', initialNodeStyle);
          });
      });
  });

  it('should extend a selection box to an off-screen node while auto-panning', () => {
    cy.get('.f-node.f-selected').should('have.length', 0);
    cy.get('example-toolbar input[type="number"]').eq(1).clear().type('8');

    cy.get('[data-f-node-id="movable-node"]').then(($firstNode: JQuery<HTMLElement>) => {
      const firstRect = $firstNode[0].getBoundingClientRect();

      cy.get('[data-f-node-id="selection-middle-node"]').then(
        ($secondNode: JQuery<HTMLElement>) => {
          const secondRect = $secondNode[0].getBoundingClientRect();
          const startX = Math.min(firstRect.left, secondRect.left) - 20;
          const startY = Math.min(firstRect.top, secondRect.top) - 60;
          const endY = Math.max(firstRect.bottom, secondRect.bottom) + 60;

          cy.get('f-flow').then(($flow: JQuery<HTMLElement>) => {
            const flowRect = $flow[0].getBoundingClientRect();
            const edgeX = flowRect.right - 48;

            cy.get('f-flow').trigger('mousedown', {
              button: 0,
              clientX: startX,
              clientY: startY,
              shiftKey: true,
              force: true,
            });

            cy.get('body')
              .trigger('mousemove', {
                clientX: startX + 5,
                clientY: startY + 5,
                shiftKey: true,
                force: true,
              })
              .trigger('mousemove', {
                clientX: edgeX,
                clientY: endY,
                shiftKey: true,
                force: true,
              });

            cy.get('[data-f-node-id="selection-offscreen-node"]', { timeout: 4000 }).should(
              'have.class',
              'f-selected',
            );
            cy.get('.f-node.f-selected').should('have.length', 3);

            cy.get('f-selection-area').should(($area: JQuery<HTMLElement>) => {
              expect(getComputedStyle($area[0]).display).to.not.equal('none');
            });

            cy.get('body').trigger('pointerup', {
              clientX: edgeX,
              clientY: endY,
              shiftKey: true,
              force: true,
            });
          });
        },
      );
    });

    cy.get('[data-f-node-id="selection-offscreen-node"]', { timeout: 4000 }).should(
      'have.class',
      'f-selected',
    );
    cy.get('.f-node.f-selected').should('have.length', 3);
  });
});
