describe('ConnectionWaypoints', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/examples/connection-waypoints');
    cy.get('f-flow').scrollIntoView();
    cy.wait(200);
  });

  it('should render all configured waypoints', () => {
    cy.get('.f-connection-waypoints').should('have.length', 4);
    cy.get('.f-waypoint').should('have.length', 12);
    cy.get('f-checkbox').should('have.length', 2);
  });
});
