describe("Authentication", () => {
  let testEmail;
  const testPassword = "testpass123";

  beforeEach(() => {
    testEmail = `testuser${Date.now()}${Math.random()
      .toString(36)
      .substring(2)}@example.com`;
    cy.clearLocalStorage();
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
    cy.visit("/");
  });

  context("Registration validation", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.getByData("user-button").first().click({ force: true });
      cy.url().should("include", "/login");
      cy.contains("Need an account? Sign up").click();
    });

    it("Shows error for missing last name", () => {
      cy.getById("firstName").type("Test");
      cy.getById("firstName").type("Test");
      cy.getById("email").type(testEmail);
      cy.getById("password").type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.getById("lastName").should("have.attr", "required");
      cy.getById("lastName").should("have.value", "");
    });

    it("Shows error for missing email", () => {
      cy.getById("firstName").type("Test");
      cy.getById("lastName").type("User");
      cy.getById("password").type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.getById("email").should("have.attr", "required");
      cy.getById("email").should("have.value", "");
    });

    it("Shows error for missing password", () => {
      cy.getById("firstName").type("Test");
      cy.getById("lastName").type("User");
      cy.getById("email").type(testEmail);
      cy.get('button[type="submit"]').click();
      cy.getById("password").should("have.attr", "required");
      cy.getById("password").should("have.value", "");
    });

    it("Shows error for weak password", () => {
      cy.getById("firstName").type("Test");
      cy.getById("lastName").type("User");
      cy.getById("email").type(testEmail);
      cy.getById("password").type("12345"); // Less than 6 characters
      cy.get('button[type="submit"]').click();
      cy.contains("Password should be at least 6 characters").should(
        "be.visible"
      );
    });
  });

  context("Registration paths", () => {
    context("Register from user button", () => {
      beforeEach(() => {
        cy.getByData("user-button").first().click({ force: true });
        cy.url().should("include", "/login");
        cy.contains("Need an account? Sign up").click();
      });

      it("Register as art lover", () => {
        cy.getByData("purchase-artwork-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
        cy.visit("/for-art-lovers");
      });

      it("Register as artist", () => {
        cy.getByData("open-art-gallery-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
        cy.visit("/for-artists");
      });
    });

    context("Register from home page", () => {
      beforeEach(() => {
        cy.getByData("artists-button").first().click();
        cy.url().should("include", "/login");
        cy.contains("Need an account? Sign up").click();
      });

      it("Register as art lover", () => {
        cy.getByData("purchase-artwork-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
        cy.visit("/for-art-lovers");
      });

      it("Register as artist", () => {
        cy.getByData("open-art-gallery-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
        cy.visit("/for-artists");
      });
    });

    context("Register from artists page (from menu)", () => {
      beforeEach(() => {
        cy.getByData("burger-menu-btn").first().click({ force: true });
        cy.getByData("artists-menu-btn").first().click({ force: true });
        cy.visit("/for-artists");
        cy.getByData("button-artists-page").click();
        cy.url().should("include", "/login");
        cy.contains("Need an account? Sign up").click();
      });

      it("Register as art lover", () => {
        cy.getByData("purchase-artwork-button").should("be.visible").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
      });

      it("Register as artist", () => {
        cy.getByData("open-art-gallery-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
      });
    });

    context("Register from favorites page", () => {
      beforeEach(() => {
        cy.getByData("favorites-button").first().click({ force: true });
        cy.url().should("include", "/login");
        cy.contains("Need an account? Sign up").click();
      });

      it("Register as art lover", () => {
        cy.getByData("purchase-artwork-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
        cy.visit("/for-art-lovers");
      });

      it("Register as artist", () => {
        cy.getByData("open-art-gallery-button").click();
        cy.getById("firstName").type("Test");
        cy.getById("lastName").type("User");
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
        cy.visit("/for-artists");
      });
    });
  });

  context.only("login paths", () => {
    // Create both test users before running login tests
    beforeEach(() => {
      // Create art lover test user
      cy.visit('/');
      cy.getByData("user-button").first().click({ force: true });
      cy.contains("Need an account? Sign up").click();
      cy.getByData("purchase-artwork-button").click();
      cy.getById("firstName").type("Test");
      cy.getById("lastName").type("User");
      cy.getById("email").type(testEmail);
      cy.getById("password").type(testPassword);
      cy.get('button[type="submit"]').click();
      // Wait for redirect and log out after creating art lover
      cy.location('pathname').should('equal', '/for-art-lovers');
      cy.getByData("user-button").first().click({ force: true });
      cy.getByData("art-lover-dashboard-logout-button").click();

      // Create artist test user
      cy.getByData("user-button").first().click({ force: true });
      cy.contains("Need an account? Sign up").click();
      cy.getByData("open-art-gallery-button").click();
      cy.getById("firstName").type("Test");
      cy.getById("lastName").type("Artist");
      cy.getById("email").type(`artist${testEmail}`);
      cy.getById("password").type(testPassword);
      cy.get('button[type="submit"]').click();
      // Wait for redirect and log out after creating artist
      cy.location('pathname').should('equal', '/for-artists');
      cy.getByData("user-button").first().click({ force: true });
      cy.getByData("artist-dashboard-logout-button").click();
    });

    context("Login from user button", () => {
      beforeEach(() => {
        cy.getByData("user-button").first().click({ force: true });
      });

      it("Login as art lover", () => {
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
      });

      it("Login as artist", () => {
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
      });
    });

    context("Login from home page", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.getByData("artists-button").first().click();
      });

      it("Login as art lover", () => {
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
      });

      it("Login as artist", () => {
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
      });
    });

    context.only("Login from artists page (from menu)", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.get("body").should("be.visible");
        cy.getByData("burger-menu-btn")
          .should("exist")
          .should("be.visible")
          .click();
        cy.getByData("artists-menu-btn")
          .should("exist")
          .should("be.visible")
          .click();
      });

      it("Login as art lover", () => {
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
      });

      it("Login as artist", () => {
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
      });
    });

    context("Login from favorites page", () => {
      beforeEach(() => {
        cy.getByData("favorites-button").first().click({ force: true });
      });

      it("Login as art lover", () => {
        cy.getById("email").type(testEmail);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-art-lovers");
      });

      it("Login as artist", () => {
        cy.getById("email").type(`artist${testEmail}`);
        cy.getById("password").type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.location("pathname").should("equal", "/for-artists");
      });
    });
  });
});
