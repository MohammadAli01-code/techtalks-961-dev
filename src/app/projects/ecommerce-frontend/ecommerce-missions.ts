import type {
  PortfolioMission,
  PortfolioLevel,
} from "../personal-portfolio/portfolio-missions";

// Reuse the existing guided learning data structure.
export type EcommerceMission = PortfolioMission;
export type EcommerceLevel = PortfolioLevel;

// LEVELS: Learning objectives and preparation.
export const ecommerceLevels: Record<number, EcommerceLevel> = {
  1: {
    name: "Project Setup & HTML Structure",
    goal: "Build the semantic HTML foundation of an online store.",
    given: [
      "Create index.html, styles.css, and script.js.",
      "Use semantic HTML elements.",
      "Assign unique IDs to interactive elements.",
    ],
  },

  2: {
    name: "CSS Styling & Responsive Design",
    goal: "Design a modern and responsive shopping experience.",
    given: [
      "Keep the HTML structure from Level 1.",
      "Use CSS variables, Flexbox, and Grid.",
      "Consider desktop and mobile users.",
    ],
  },

  3: {
    name: "Dynamic Products, Search & Filtering",
    goal: "Render and filter product data dynamically using JavaScript.",
    given: [
      "Use JavaScript arrays and objects.",
      "Understand DOM manipulation.",
      "Use event listeners and array filtering.",
    ],
  },

  4: {
    name: "Shopping Cart & Price Calculation",
    goal: "Build an interactive shopping cart with accurate totals.",
    given: [
      "Maintain cart data in a JavaScript array.",
      "Use product IDs to identify items.",
      "Update the interface whenever the cart changes.",
    ],
  },

  5: {
    name: "Local Storage & Final Testing",
    goal: "Persist shopping cart data and test the complete application.",
    given: [
      "Understand JSON serialization.",
      "Use the browser Local Storage API.",
      "Test functionality, responsiveness, and accessibility.",
    ],
  },
};

// MISSIONS: Complete guided learning content.
export const ecommerceMissions: EcommerceMission[] = [

  // ==========================================
  // LEVEL 1 — HTML STRUCTURE
  // ==========================================

  {
    number: 1,
    level: 1,
    levelTitle: ecommerceLevels[1].name,

    title: "Set up the project files",

    why: "A clean project structure separates content, styling, and application logic, making the store easier to develop and maintain.",

    workIn:
      "Create a folder named ecommerce-frontend containing index.html, styles.css, and script.js.",

    tasks: [
      "Create the project folder.",
      "Create index.html.",
      "Create styles.css.",
      "Create script.js.",
      "Add the HTML5 document structure.",
      "Connect the CSS and JavaScript files.",
      "Open index.html in your browser.",
    ],

    completedWhen:
      "The browser displays the TechStore heading without errors.",

    hint1:
      "Separate HTML structure, CSS styling, and JavaScript behavior into different files.",

    hint2:
      "Use a link element for CSS and a script element with defer for JavaScript.",

    solutionLanguage: "html",

    solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>TechStore</title>

  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>

<body>
  <main id="store">
    <h1>TechStore</h1>
  </main>
</body>
</html>`,

    check:
      "The page opens successfully and the browser tab displays TechStore.",

    image: null,
  },

  {
    number: 2,
    level: 1,
    levelTitle: ecommerceLevels[1].name,

    title: "Build the store header and navigation",

    why: "The header provides the store identity, navigation links, and a clear shopping cart indicator.",

    workIn:
      "index.html. Insert the header immediately before the existing main element.",

    tasks: [
      "Create a semantic header.",
      "Display the TechStore brand.",
      "Create navigation links.",
      "Add a shopping cart button.",
      "Create a cart count indicator.",
      "Use meaningful accessibility labels.",
    ],

    completedWhen:
      "The store header displays the brand, navigation, and a cart count of zero.",

    hint1:
      "Use header and nav elements to organize the navigation area.",

    hint2:
      "Give the cart button and its count unique IDs for future JavaScript updates.",

    solutionLanguage: "html",

    solution: `<header class="store-header">
  <div class="header-inner">

    <a href="#store" class="brand">
      <span>Tech</span>Store
    </a>

    <nav aria-label="Main navigation">
      <a href="#store">Home</a>
      <a href="#products">Products</a>
    </nav>

    <button
      id="cart-toggle"
      type="button"
      aria-controls="cart-panel"
      aria-expanded="false"
    >
      Cart (<span id="cart-count">0</span>)
    </button>

  </div>
</header>`,

    check:
      "The navigation links and shopping cart button are visible. Cart interaction will be implemented later.",

    image: null,
  },

  {
    number: 3,
    level: 1,
    levelTitle: ecommerceLevels[1].name,

    title: "Create the product catalog and shopping cart structure",

    why: "Dedicated containers allow JavaScript to update products, search results, cart items, and checkout information dynamically.",

    workIn:
      "index.html. Replace the existing main element with the following structure. Keep the header from Mission 2.",

    tasks: [
      "Create the store introduction section.",
      "Add a product search input.",
      "Create a category filter.",
      "Create a product grid container.",
      "Create the shopping cart section.",
      "Add subtotal, shipping, and total fields.",
      "Create checkout and close-cart buttons.",
      "Add a status message for user feedback.",
    ],

    completedWhen:
      "All catalog and shopping cart elements exist in the HTML document.",

    hint1:
      "JavaScript will later insert product cards inside an empty product grid.",

    hint2:
      "Use unique IDs such as product-grid, cart-items, and cart-total.",

    solutionLanguage: "html",

    solution: `<main id="store" class="store-container">

  <section class="store-hero">
    <p class="eyebrow">TECH ESSENTIALS</p>
    <h1>Explore Our Products</h1>
    <p>Discover technology for your everyday needs.</p>
  </section>

  <section id="products" aria-label="Product catalog">

    <div class="catalog-controls">

      <div>
        <label for="search-input">Search products</label>

        <input
          id="search-input"
          type="search"
          placeholder="Search products..."
        >
      </div>

      <div>
        <label for="category-filter">Category</label>

        <select id="category-filter">
          <option value="all">All categories</option>
          <option value="Audio">Audio</option>
          <option value="Accessories">Accessories</option>
          <option value="Computing">Computing</option>
        </select>
      </div>

    </div>

    <p id="product-count" aria-live="polite">
      Products will appear here.
    </p>

    <div id="product-grid"></div>

  </section>

  <aside
    id="cart-panel"
    aria-labelledby="cart-title"
    hidden
  >
    <div class="cart-header">
      <h2 id="cart-title">Shopping Cart</h2>

      <button id="close-cart" type="button">
        Close
      </button>
    </div>

    <div id="cart-items"></div>

    <div class="cart-summary">

      <p>
        Subtotal:
        <strong id="cart-subtotal">$0.00</strong>
      </p>

      <p>
        Shipping:
        <strong id="shipping-cost">$0.00</strong>
      </p>

      <p class="total-line">
        Total:
        <strong id="cart-total">$0.00</strong>
      </p>

      <button id="checkout-button" type="button" disabled>
        Checkout
      </button>

    </div>
  </aside>

  <p id="store-status" role="status"></p>

</main>`,

    check:
      "The search input and category selector are visible. The cart panel is hidden until it is opened.",

    image: null,
  },

  // ==========================================
  // LEVEL 2 — CSS STYLING
  // ==========================================

  {
    number: 4,
    level: 2,
    levelTitle: ecommerceLevels[2].name,

    title: "Create the global styles and design system",

    why: "Reusable colors and spacing rules create a consistent professional appearance throughout the store.",

    workIn:
      "styles.css. Add the following global and header styles.",

    tasks: [
      "Define reusable CSS color variables.",
      "Reset default browser spacing.",
      "Style the page background and typography.",
      "Create a consistent content container.",
      "Style the store header.",
      "Style the brand and navigation links.",
      "Add accessible keyboard focus styles.",
    ],

    completedWhen:
      "The store displays a dark professional theme with blue and cyan accents.",

    hint1:
      "Use CSS custom properties inside :root.",

    hint2:
      "Use Flexbox to align the brand, navigation, and cart button.",

    solutionLanguage: "css",

    solution: `:root {
  --background: #080d1e;
  --surface: #151d34;
  --primary: #0066ff;
  --cyan: #22d3ee;
  --text: #f8fafc;
  --muted: #94a3b8;
  --border: #334155;
  --success: #22c55e;
  --danger: #ef4444;
}

* {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text);
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
}

.store-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1200px;
  margin: auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  font-size: 24px;
  font-weight: bold;
}

.brand span {
  color: var(--cyan);
}

nav {
  display: flex;
  gap: 20px;
}

nav a:hover {
  color: var(--cyan);
}

#cart-toggle {
  border: 1px solid var(--cyan);
  border-radius: 10px;
  background: transparent;
  color: var(--cyan);
  padding: 8px 16px;
}

.store-container {
  max-width: 1200px;
  margin: auto;
  padding: 32px 24px;
}

.store-hero {
  padding: 30px 0;
}

.store-hero h1 {
  font-size: clamp(28px, 5vw, 42px);
  margin: 8px 0;
}

.store-hero p {
  color: var(--muted);
}

.eyebrow {
  color: var(--cyan) !important;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}`,

    check:
      "The header and main content use consistent colors and spacing.",

    image: null,
  },

  {
    number: 5,
    level: 2,
    levelTitle: ecommerceLevels[2].name,

    title: "Design the product cards and catalog layout",

    why: "A responsive product grid helps customers browse products and compare prices efficiently.",

    workIn:
      "styles.css. Append these catalog and product card styles below Mission 4.",

    tasks: [
      "Style the search and filter controls.",
      "Create a responsive product grid.",
      "Design reusable product cards.",
      "Create a product illustration area.",
      "Style product names, categories, and prices.",
      "Design Add to Cart buttons.",
      "Add product card hover effects.",
    ],

    completedWhen:
      "The stylesheet contains reusable product card styles ready for dynamic rendering.",

    hint1:
      "Use CSS Grid with auto-fit to create flexible product columns.",

    hint2:
      "Use repeat(auto-fit, minmax(...)) to adapt the grid to available space.",

    solutionLanguage: "css",

    solution: `.catalog-controls {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.catalog-controls label {
  display: block;
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 6px;
}

.catalog-controls input,
.catalog-controls select {
  width: 100%;
  padding: 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  color-scheme: dark;
}

#product-count {
  color: var(--muted);
  font-size: 14px;
}

#product-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 230px), 1fr));
  gap: 20px;
}

.product-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  transition: border-color 0.2s, transform 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--cyan);
}

.product-icon {
  display: grid;
  place-items: center;
  min-height: 130px;
  background: var(--background);
  border-radius: 12px;
  font-size: 56px;
}

.product-category {
  color: var(--cyan);
  font-size: 12px;
  margin-top: 12px;
}

.product-card h3 {
  margin: 8px 0;
  font-size: 17px;
}

.product-price {
  margin-top: auto;
  font-size: 22px;
  font-weight: bold;
}

.add-to-cart,
#checkout-button {
  width: 100%;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  font-weight: bold;
  padding: 12px;
}

.add-to-cart:hover,
#checkout-button:hover:not(:disabled) {
  background: #0052cc;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 30px;
  text-align: center;
  color: var(--muted);
}`,

    check:
      "The search and filter controls are styled. Product cards will become visible in Mission 8.",

    image: null,
  },

  {
    number: 6,
    level: 2,
    levelTitle: ecommerceLevels[2].name,

    title: "Style the shopping cart and responsive layouts",

    why: "Customers need a readable shopping cart and a store interface that works on different screen sizes.",

    workIn:
      "styles.css. Append the cart and responsive styles.",

    tasks: [
      "Create a fixed shopping cart panel.",
      "Style the cart header.",
      "Design cart item rows.",
      "Style quantity controls.",
      "Style the price summary.",
      "Add mobile media queries.",
      "Prevent horizontal overflow.",
    ],

    completedWhen:
      "The cart styles are prepared and the catalog controls adapt to mobile screens.",

    hint1:
      "Use position: fixed to display the cart above the main content.",

    hint2:
      "Use a media query to stack the navigation and search controls on narrow screens.",

    solutionLanguage: "css",

    solution: `#cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  width: min(420px, 100%);
  overflow-y: auto;
  background: var(--surface);
  border-left: 1px solid var(--border);
  padding: 24px;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}

.cart-header h2 {
  margin: 0;
}

#close-cart,
.quantity-button,
.remove-button {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
}

.cart-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.cart-item h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.cart-item-price {
  color: var(--cyan);
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.remove-button {
  color: #fca5a5;
}

.cart-summary {
  margin-top: 24px;
  padding: 18px;
  background: var(--background);
  border-radius: 12px;
}

.cart-summary p {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.total-line {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  color: var(--cyan);
  font-size: 20px;
}

#store-status {
  color: var(--cyan);
  font-size: 14px;
}

@media (max-width: 600px) {
  .header-inner {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
  }

  nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .store-container {
    padding: 20px 16px;
  }

  .catalog-controls {
    grid-template-columns: 1fr;
  }

  #cart-panel {
    padding: 16px;
  }
}`,

    check:
      "At mobile widths, the search and category controls stack vertically and no horizontal scrolling is needed.",

    image: null,
  },

  // ==========================================
  // LEVEL 3 — DYNAMIC PRODUCTS
  // ==========================================

  {
    number: 7,
    level: 3,
    levelTitle: ecommerceLevels[3].name,

    title: "Create the product data array",

    why: "Separating product data from HTML allows the application to generate and manage products efficiently.",

    workIn:
      "script.js. Create the product data array and currency formatting function.",

    tasks: [
      "Create an array named products.",
      "Represent products as JavaScript objects.",
      "Assign each product a unique ID.",
      "Add names and categories.",
      "Store prices as numbers.",
      "Add product illustration icons.",
      "Create six different products.",
      "Create a reusable currency formatting function.",
    ],

    completedWhen:
      "The products array contains six valid objects with unique IDs.",

    hint1:
      "Use the same property names for every product object.",

    hint2:
      "Store prices in cents as integers to avoid floating-point rounding problems.",

    solutionLanguage: "javascript",

    solution: `const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Audio",
    price: 5900,
    icon: "🎧"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Accessories",
    price: 7900,
    icon: "⌚"
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Computing",
    price: 8900,
    icon: "⌨️"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 4500,
    icon: "🔊"
  },
  {
    id: 5,
    name: "Wireless Mouse",
    category: "Computing",
    price: 2900,
    icon: "🖱️"
  },
  {
    id: 6,
    name: "Portable Charger",
    category: "Accessories",
    price: 3900,
    icon: "🔋"
  }
];

function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}`,

    check:
      "Typing products.length in the browser console returns 6, and formatPrice(5900) returns $59.00.",

    image: null,
  },

  {
    number: 8,
    level: 3,
    levelTitle: ecommerceLevels[3].name,

    title: "Render product cards dynamically",

    why: "Dynamic rendering makes the interface automatically reflect the product data instead of requiring manually written HTML cards.",

    workIn:
      "script.js. Append the rendering function below the product data.",

    tasks: [
      "Select the product grid container.",
      "Select the product count element.",
      "Create a renderProducts function.",
      "Clear previously rendered products.",
      "Create a product card for each object.",
      "Display product information and price.",
      "Add a product ID to each Add to Cart button.",
      "Render the initial product list.",
    ],

    completedWhen:
      "All six products appear in the catalog with their names, categories, prices, and buttons.",

    hint1:
      "Use forEach to process every product in the array.",

    hint2:
      "Use document.createElement and textContent to construct product elements.",

    solutionLanguage: "javascript",

    solution: `const productGrid =
  document.getElementById("product-grid");

const productCount =
  document.getElementById("product-count");

function createTextElement(tag, text, className) {
  const element = document.createElement(tag);

  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function renderProducts(items) {
  productGrid.innerHTML = "";

  productCount.textContent =
    items.length + " products found";

  if (items.length === 0) {
    productGrid.appendChild(
      createTextElement(
        "p",
        "No products found.",
        "empty-state"
      )
    );

    return;
  }

  items.forEach((product) => {
    const card = document.createElement("article");

    card.className = "product-card";

    const icon = createTextElement(
      "div",
      product.icon,
      "product-icon"
    );

    icon.setAttribute("aria-hidden", "true");

    const category = createTextElement(
      "p",
      product.category,
      "product-category"
    );

    const name = createTextElement(
      "h3",
      product.name
    );

    const price = createTextElement(
      "p",
      formatPrice(product.price),
      "product-price"
    );

    const button = createTextElement(
      "button",
      "Add to Cart",
      "add-to-cart"
    );

    button.type = "button";
    button.dataset.id = product.id;

    button.setAttribute(
      "aria-label",
      "Add " + product.name + " to cart"
    );

    card.append(icon, category, name, price, button);

    productGrid.appendChild(card);
  });
}

renderProducts(products);`,

    check:
      "Six product cards appear. Add to Cart buttons are visible but will become functional in Mission 10.",

    image: "/projects/ecommerce-frontend/mission-08.png",
  },

  {
    number: 9,
    level: 3,
    levelTitle: ecommerceLevels[3].name,

    title: "Implement product search and category filtering",

    why: "Search and filtering help customers find relevant products without browsing the complete catalog.",

    workIn:
      "script.js. Append the search and filtering logic.",

    tasks: [
      "Select the search input.",
      "Select the category dropdown.",
      "Read the current search value.",
      "Convert search text to lowercase.",
      "Filter products by name.",
      "Filter products by category.",
      "Combine both filtering conditions.",
      "Render the filtered products.",
      "Display an empty state when no products match.",
    ],

    completedWhen:
      "Search and category filters update the product grid immediately.",

    hint1:
      "Use the filter method to create a new array without modifying the original products array.",

    hint2:
      "Combine name matching and category matching using the logical AND operator.",

    solutionLanguage: "javascript",

    solution: `const searchInput =
  document.getElementById("search-input");

const categoryFilter =
  document.getElementById("category-filter");

function filterProducts() {
  const search =
    searchInput.value.trim().toLowerCase();

  const category = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

searchInput.addEventListener(
  "input",
  filterProducts
);

categoryFilter.addEventListener(
  "change",
  filterProducts
);`,

    check:
      "Searching for Wireless displays matching products. Selecting Audio displays only Audio products when the search input is empty.",

    image: "/projects/ecommerce-frontend/mission-09.png",
  },

  // ==========================================
  // LEVEL 4 — SHOPPING CART
  // ==========================================

  {
    number: 10,
    level: 4,
    levelTitle: ecommerceLevels[4].name,

    title: "Implement Add to Cart functionality",

    why: "The shopping cart must track selected products and combine repeated additions into quantities.",

    workIn:
      "script.js. Append the shopping cart state, rendering, and event handling code.",

    tasks: [
      "Create an empty cart array.",
      "Select the shopping cart elements.",
      "Identify products using their IDs.",
      "Check whether a product already exists in the cart.",
      "Increase its quantity if it already exists.",
      "Add a new cart item if needed.",
      "Display selected products in the cart.",
      "Update the cart count.",
      "Implement opening and closing the cart.",
    ],

    completedWhen:
      "Adding products updates the shopping cart and its quantity indicator.",

    hint1:
      "Use find to locate an existing cart item.",

    hint2:
      "Store only the product ID and quantity in each cart object.",

    solutionLanguage: "javascript",

    solution: `let cart = [];

const MAX_QUANTITY = 99;

const cartPanel =
  document.getElementById("cart-panel");

const cartToggle =
  document.getElementById("cart-toggle");

const closeCartButton =
  document.getElementById("close-cart");

const cartCount =
  document.getElementById("cart-count");

const cartItems =
  document.getElementById("cart-items");

const storeStatus =
  document.getElementById("store-status");

function renderCart() {
  cartItems.innerHTML = "";

  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cart.forEach((item) => {
    const product = products.find(
      (product) => product.id === item.id
    );

    const row = document.createElement("article");

    row.className = "cart-item";

    row.append(
      createTextElement("h3", product.name),
      createTextElement(
        "p",
        "Quantity: " + item.quantity
      )
    );

    cartItems.appendChild(row);
  });
}

function addToCart(productId) {
  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) return;

  const existingItem = cart.find(
    (item) => item.id === productId
  );

  if (existingItem) {
    if (existingItem.quantity >= MAX_QUANTITY) {
      storeStatus.textContent =
        "Maximum quantity reached.";

      return;
    }

    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  renderCart();

  storeStatus.textContent =
    product.name + " added to cart.";
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");

  if (!button) return;

  addToCart(Number(button.dataset.id));
});

function openCart() {
  cartPanel.hidden = false;
  cartToggle.setAttribute("aria-expanded", "true");
  closeCartButton.focus();
}

function closeCart() {
  cartPanel.hidden = true;
  cartToggle.setAttribute("aria-expanded", "false");
  cartToggle.focus();
}

cartToggle.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartPanel.hidden) {
    closeCart();
  }
});

renderCart();`,

    check:
      "Adding the same product twice displays a quantity of two and increases the cart count correctly.",

    image: "/projects/ecommerce-frontend/mission-10.png",
  },

  {
    number: 11,
    level: 4,
    levelTitle: ecommerceLevels[4].name,

    title: "Update quantities and remove products",

    why: "Customers must be able to change quantities and remove unwanted products before checkout.",

    workIn:
      "script.js. Replace only the existing renderCart function with the version below. Append the quantity and removal functions after the existing code.",

    tasks: [
      "Display increase and decrease quantity buttons.",
      "Create a remove product button.",
      "Identify cart items using product IDs.",
      "Update product quantities.",
      "Prevent quantities above the maximum.",
      "Remove products when quantity reaches zero.",
      "Update the cart after every change.",
    ],

    completedWhen:
      "The cart supports increasing, decreasing, and removing products.",

    hint1:
      "Use filter to remove an item from the cart array.",

    hint2:
      "Use a data-action attribute to distinguish increase, decrease, and remove buttons.",

    solutionLanguage: "javascript",

    solution: `// Replace the existing renderCart function.

function renderCart() {
  cartItems.innerHTML = "";

  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cart.forEach((item) => {
    const product = products.find(
      (product) => product.id === item.id
    );

    const row = document.createElement("article");

    row.className = "cart-item";

    const name = createTextElement(
      "h3",
      product.name
    );

    const price = createTextElement(
      "p",
      formatPrice(product.price),
      "cart-item-price"
    );

    const controls = document.createElement("div");

    controls.className = "quantity-controls";

    const decrease = createCartButton(
      "-",
      "decrease",
      item.id,
      "quantity-button"
    );

    const quantity = createTextElement(
      "span",
      String(item.quantity)
    );

    const increase = createCartButton(
      "+",
      "increase",
      item.id,
      "quantity-button"
    );

    increase.disabled =
      item.quantity >= MAX_QUANTITY;

    const remove = createCartButton(
      "Remove",
      "remove",
      item.id,
      "remove-button"
    );

    controls.append(
      decrease,
      quantity,
      increase,
      remove
    );

    row.append(name, price, controls);

    cartItems.appendChild(row);
  });
}

// Append the following functions.

function createCartButton(text, action, id, className) {
  const button = createTextElement(
    "button",
    text,
    className
  );

  button.type = "button";
  button.dataset.action = action;
  button.dataset.id = id;

  const product = products.find(
    (item) => item.id === id
  );

  button.setAttribute(
    "aria-label",
    action + " " + product.name
  );

  return button;
}

function changeQuantity(id, amount) {
  const item = cart.find(
    (item) => item.id === id
  );

  if (!item) return;

  item.quantity = Math.min(
    MAX_QUANTITY,
    item.quantity + amount
  );

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(
    (item) => item.id !== id
  );

  renderCart();
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest(
    "button[data-action]"
  );

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(id, 1);
  } else if (action === "decrease") {
    changeQuantity(id, -1);
  } else if (action === "remove") {
    removeFromCart(id);
  }
});`,

    check:
      "Increasing and decreasing quantities works. Removing an item updates the cart count, and quantities cannot become negative.",

    image: "/projects/ecommerce-frontend/mission-11.png",
  },

  {
    number: 12,
    level: 4,
    levelTitle: ecommerceLevels[4].name,

    title: "Calculate cart totals and update the interface",

    why: "Accurate price calculations are essential for a reliable shopping cart.",

    workIn:
      "script.js. Append the total calculation code. Add updateCartTotals() at the end of renderCart, after its forEach block. Keep the final renderCart call below the new declarations.",

    tasks: [
      "Select the subtotal element.",
      "Select the shipping cost element.",
      "Select the final total element.",
      "Calculate price multiplied by quantity.",
      "Sum the prices of all cart items.",
      "Apply a five-dollar shipping fee to non-empty carts.",
      "Update the displayed totals.",
      "Disable checkout when the cart is empty.",
    ],

    completedWhen:
      "Subtotal, shipping, and total values update whenever the cart changes.",

    hint1:
      "Use reduce to calculate the sum of product prices multiplied by their quantities.",

    hint2:
      "All prices are stored in cents, so five dollars is represented by 500.",

    solutionLanguage: "javascript",

    solution: `const subtotalElement =
  document.getElementById("cart-subtotal");

const shippingElement =
  document.getElementById("shipping-cost");

const totalElement =
  document.getElementById("cart-total");

const checkoutButton =
  document.getElementById("checkout-button");

function calculateTotals() {
  const subtotal = cart.reduce((total, item) => {
    const product = products.find(
      (product) => product.id === item.id
    );

    return total + product.price * item.quantity;
  }, 0);

  const shipping = cart.length > 0 ? 500 : 0;

  return {
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping
  };
}

function updateCartTotals() {
  const totals = calculateTotals();

  subtotalElement.textContent =
    formatPrice(totals.subtotal);

  shippingElement.textContent =
    formatPrice(totals.shipping);

  totalElement.textContent =
    formatPrice(totals.total);

  checkoutButton.disabled = cart.length === 0;
}

// Add updateCartTotals() at the end of
// the existing renderCart function.
//
// Move the initial renderCart() call to
// the bottom of script.js, after all
// declarations above have been initialized.`,

    check:
      "Two headphones priced at $59 each produce a subtotal of $118.00, shipping of $5.00, and a total of $123.00.",

    image: "/projects/ecommerce-frontend/mission-12.png",
  },

  // ==========================================
  // LEVEL 5 — STORAGE AND TESTING
  // ==========================================

  {
    number: 13,
    level: 5,
    levelTitle: ecommerceLevels[5].name,

    title: "Save and restore cart data using Local Storage",

    why: "Local Storage allows the shopping cart to survive a browser refresh without requiring a backend database.",

    workIn:
      "script.js. Append the storage functions. Add saveCart() at the end of renderCart, after updateCartTotals(). Replace the initial renderCart() call with the initialization shown below.",

    tasks: [
      "Choose a unique Local Storage key.",
      "Convert the cart array into JSON.",
      "Save cart data after changes.",
      "Read the saved cart when the page loads.",
      "Convert JSON back into JavaScript data.",
      "Validate saved product IDs and quantities.",
      "Handle missing or invalid storage data.",
      "Verify persistence after refreshing.",
    ],

    completedWhen:
      "The shopping cart retains valid products and quantities after a browser refresh.",

    hint1:
      "Local Storage stores strings, not JavaScript arrays directly.",

    hint2:
      "Use JSON.stringify to save the array and JSON.parse to restore it.",

    solutionLanguage: "javascript",

    solution: `const CART_STORAGE_KEY = "techstore-cart";

function saveCart() {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch {
    storeStatus.textContent =
      "Cart storage is unavailable.";
  }
}

function loadCart() {
  try {
    const savedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    const validCart = [];

    parsedCart.forEach((item) => {
      if (
        !item ||
        !products.some(
          (product) => product.id === item.id
        ) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return;
      }

      const existing = validCart.find(
        (entry) => entry.id === item.id
      );

      if (existing) {
        existing.quantity = Math.min(
          MAX_QUANTITY,
          existing.quantity + item.quantity
        );
      } else {
        validCart.push({
          id: item.id,
          quantity: Math.min(
            MAX_QUANTITY,
            item.quantity
          )
        });
      }
    });

    return validCart;

  } catch {
    return [];
  }
}

// Add saveCart() at the end of renderCart.
//
// Remove the previous standalone renderCart()
// initialization and replace it with these
// two lines at the bottom of script.js:

cart = loadCart();
renderCart();`,

    check:
      "Add products, refresh the page, and verify that quantities and totals are restored correctly. Test using a local HTTP server for reliable storage behavior.",

    image: "/projects/ecommerce-frontend/mission-13.png",
  },

  {
    number: 14,
    level: 5,
    levelTitle: ecommerceLevels[5].name,

    title: "Implement checkout summary and empty cart states",

    why: "A complete shopping experience needs clear feedback when the cart is empty and when checkout is simulated.",

    workIn:
      "script.js. Append the empty state and checkout functions before the final initialization. Add renderEmptyCartState() inside renderCart after the product rendering loop.",

    tasks: [
      "Display a message when the cart is empty.",
      "Keep checkout disabled for an empty cart.",
      "Calculate the final order total.",
      "Create a simulated checkout confirmation.",
      "Allow the customer to cancel checkout.",
      "Clear the cart after confirmation.",
      "Update Local Storage and cart totals.",
      "Display a successful demo checkout message.",
    ],

    completedWhen:
      "The application can simulate checkout, clear the cart, and display a meaningful empty cart message.",

    hint1:
      "Check whether cart.length equals zero before processing checkout.",

    hint2:
      "Clearing the cart and calling renderCart updates both the interface and saved cart data.",

    solutionLanguage: "javascript",

    solution: `function renderEmptyCartState() {
  if (cart.length === 0) {
    cartItems.appendChild(
      createTextElement(
        "p",
        "Your cart is empty.",
        "empty-state"
      )
    );
  }
}

function checkout() {
  if (cart.length === 0) return;

  const totals = calculateTotals();

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const confirmed = window.confirm(
    "Demo checkout only. " +
    itemCount + " item(s). " +
    "Total: " + formatPrice(totals.total) +
    ". Confirm?"
  );

  if (!confirmed) return;

  cart = [];

  renderCart();
  closeCart();

  storeStatus.textContent =
    "Demo checkout completed successfully. " +
    "No payment was processed.";
}

checkoutButton.addEventListener(
  "click",
  checkout
);

// Add renderEmptyCartState() inside renderCart
// after the product rendering loop.
//
// Keep updateCartTotals() and saveCart()
// at the end of renderCart.
//
// Keep cart = loadCart() and renderCart()
// as the final initialization statements.`,

    check:
      "Checkout displays a confirmation. Cancelling preserves the cart. Confirming clears the cart and displays a demo success message without processing payments.",

    image: "/projects/ecommerce-frontend/mission-14.png",
  },

  {
    number: 15,
    level: 5,
    levelTitle: ecommerceLevels[5].name,

    title: "Test and improve the complete application",

    why: "Systematic testing ensures the store behaves correctly during normal interactions and unexpected user actions.",

    workIn:
      "index.html, styles.css, script.js, and browser Developer Tools.",

    tasks: [
      "Verify that all six products appear.",
      "Test search with uppercase and lowercase letters.",
      "Test each category filter.",
      "Test combined search and category filtering.",
      "Verify the no-products-found state.",
      "Add different products to the cart.",
      "Add the same product multiple times.",
      "Test increasing and decreasing quantities.",
      "Verify the maximum quantity limit.",
      "Test removing products.",
      "Verify subtotal, shipping, and final total.",
      "Refresh and verify Local Storage persistence.",
      "Test checkout confirmation and cancellation.",
      "Test the empty cart state.",
      "Test desktop and mobile layouts.",
      "Test keyboard navigation and Escape.",
      "Check the browser console for errors.",
    ],

    completedWhen:
      "The complete store passes functional, persistence, accessibility, and responsive layout tests.",

    hint1:
      "Test both normal behavior and edge cases, such as empty carts and search results.",

    hint2:
      "Use the browser console, responsive device toolbar, and Application Storage panel.",

    solutionLanguage: "javascript",

    solution: `// Optional development checks.
// Run these in the browser console.

console.assert(
  products.length === 6,
  "The catalog should contain six products."
);

console.assert(
  new Set(
    products.map((product) => product.id)
  ).size === products.length,
  "Product IDs must be unique."
);

console.assert(
  products.every((product) =>
    Number.isInteger(product.price) &&
    product.price > 0
  ),
  "Product prices must be positive integers."
);

console.assert(
  formatPrice(5900) === "$59.00",
  "Currency formatting must be correct."
);

console.assert(
  cart.every((item) =>
    products.some(
      (product) => product.id === item.id
    ) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= MAX_QUANTITY
  ),
  "Cart items must contain valid data."
);

const totals = calculateTotals();

console.assert(
  totals.total ===
    totals.subtotal + totals.shipping,
  "The total calculation must be correct."
);

// Manual test example:
// Add two headphones and one wireless mouse.
//
// Expected subtotal: $147.00
// Expected shipping: $5.00
// Expected total: $152.00
//
// Refresh and verify that the cart is preserved.
// Cancel checkout and verify that nothing changes.
// Confirm demo checkout and verify an empty cart.`,

    check:
      "All manual tests pass, prices remain accurate, cart persistence works, and the console displays no unexpected errors.",

    image: null,
  },
];
