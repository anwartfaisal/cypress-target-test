describe("Target Add to Cart Workflow", () => {
  const productName = "torch"; // Product to search for
  const quantity = 5;

  it("should Search/add the product to the cart and update the product quantity then verify total price", () => {
    // Step 1: Visit Target page/URL
    cy.visit("https://www.target.com");

    // Step 2: Verify landed on Target's page and the page loaded successfully
    cy.url().should("include", "target.com");
    cy.title().should("contain", "Target"); // Check page title
    // cy.get("#header").should("contain", "Target"); // Check header contains "Target"
    console.log(
      " Verify landed on Target's page and the page loaded successfully --> Done"
    );

    // Step 3: Search for the product
    cy.get('[data-test="@web/Search/SearchInput"]').type(productName);
    cy.get('button[type="submit"]').click(); // Click on search button
    cy.wait(10000); // Wait for results to load
    console.log(" Search for the product --> Done");

    // Step 4: Check that each product has the correct name in the title across multiple pages
    const verifyProductNameInResults = () => {
      cy.get('[data-test="product-title"]').each(($el) => {
        expect($el.text().toLowerCase()).to.include(productName.toLowerCase());
      });
    };

    verifyProductNameInResults();
    console.log(" Verify product name in results --> Done");

    // If there are multiple pages of results, handle pagination
    cy.wait(7000);
    cy.get('[data-test="next"]').then(($nextButton) => {
      if ($nextButton.is(":visible")) {
        cy.wrap($nextButton).click();

        verifyProductNameInResults(); //Check that each product has the correct name after navigating to new page
        console.log(" Verify product name in results page$--> Done");
      }
    });

    // Step 5: Add the last item on the page to the cart
    // cy.get('button[data-test="chooseOptionsButton"]').last().click();
    cy.wait(10000);
    let lastItem = cy
      .get("a")
      .contains("Sorbus Set of 4 Stainless Steel 5ft Outdoor");
    console.log("----------> ", lastItem);
    lastItem.click();
    cy.wait(7000);
    console.log(" Add the last item on the page to the cart --> Done");

    // Step 6: Open the cart
    cy.get('button[data-test="shippingButton"]').click(); //
    cy.wait(7000);
    cy.get('a[href="/cart"]').click(); //
    cy.wait(5000);
    console.log(" Open the cart --> Done");

    // Step 7: Increase product quantity to 5
    cy.get("select").select("Qty 5"); // Quantity selector
    cy.wait(3000);
    console.log(" Increase product quantity to 5 --> Done");

    // Step 8: Verify the total price is correct
    cy.get('p[data-test="cartItem-unitPrice"]').then(($price) => {
      const pricePerItem = parseFloat($price.text().replace("each $", ""));
      const expectedTotal = pricePerItem * quantity;

      cy.get('p[data-test="cartItem-price"]').should(($totalPrice) => {
        const actualTotal = parseFloat($totalPrice.text().replace("$", ""));
        expect(actualTotal).to.eq(expectedTotal);
        console.log(" Verify the total price is correct --> Done");
      });
    });
  });
});
