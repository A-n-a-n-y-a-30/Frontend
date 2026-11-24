// ================== 1. PRODUCT DATA ==================
// A static array of objects. Each object is one product.
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    description: "Comfortable wireless headphones with clear sound and deep bass.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Electronics",
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    description: "A stylish smartwatch for fitness tracking and daily use.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Accessories",
    rating: 4.2,
    inStock: true
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    description: "Lightweight running shoes designed for comfort and everyday workouts.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "Footwear",
    rating: 4.4,
    inStock: true
  },
  {
    id: 4,
    name: "Travel Backpack",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    description: "A spacious backpack suitable for college, office, and travel.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Bags",
    rating: 4.3,
    inStock: true
  },
  {
    id: 5,
    name: "Digital Camera",
    price: 15999,
    originalPrice: 18999,
    discount: 16,
    description: "Capture memorable moments with a compact digital camera.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    category: "Electronics",
    rating: 4.6,
    inStock: true
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    description: "Modern sunglasses with a stylish frame for everyday wear.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    category: "Fashion",
    rating: 4.1,
    inStock: true
  },
  {
    id: 7,
    name: "Coffee Maker",
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    description: "Prepare fresh coffee at home with this easy-to-use coffee maker.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
    category: "Home Appliances",
    rating: 4.4,
    inStock: false
  }
];

// ================== 2. CART DATA ==================
// The cart starts empty. Each cart item looks like:
// { id, name, price, image, quantity }
let cart = [];

// Turns 2499 into "₹2,499"
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ================== 3. SHOW PRODUCT CARDS ==================
// Runs automatically when the page loads (onload="Products()")
function Products() {
  let html = "";

  // Loop through every product and build one card for each
  for (let i = 0; i < products.length; i++) {
    let p = products[i];

    // Normal (in stock) settings
    let cardClass = "";
    let badge = "";
    let button = `<button class="btn btn-success w-100" onclick="addToCart(${p.id})">Add to Cart</button>`;

    // Out of stock settings: faded card, red badge, grey disabled button
    if (p.inStock === false) {
      cardClass = "out-of-stock";
      badge = `<span class="badge bg-danger position-absolute top-50 start-50 translate-middle">OUT OF STOCK</span>`;
      button = `<button class="btn btn-secondary disabled w-100" disabled>Add to Cart</button>`;
    }

    // Add this product's card to the html string
    html += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 ${cardClass}">

          <div class="position-relative">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            ${badge}
          </div>

          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h6 class="fw-bold me-2">${p.name}</h6>
              <span class="rating text-nowrap">⭐ ${p.rating}</span>
            </div>

            <p class="text-muted desc">${p.description}</p>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span class="fw-bold">${formatPrice(p.price)}</span>
                <small class="text-muted old-price">${formatPrice(p.originalPrice)}</small>
              </div>
              <span class="badge bg-success">${p.discount}% OFF</span>
            </div>

            ${button}
          </div>

        </div>
      </div>`;
  }

  // Put all the cards on the page
  document.getElementById("productList").innerHTML = html;

  // Show the empty cart and a badge of 0
  updateCart();
}

// ================== 4. ADD TO CART ==================
function addToCart(id) {
  // Step 1: find the product with this id
  let product = null;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      product = products[i];
    }
  }

  // Safety check: never add a missing or out-of-stock product
  if (product === null || product.inStock === false) {
    return;
  }

  // Step 2: is the product already in the cart?
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].quantity = cart[i].quantity + 1; // yes: just add 1 to its quantity
      found = true;
    }
  }

  // Step 3: not in the cart yet, so add it with quantity 1
  if (found === false) {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  // Step 4: redraw the cart and slide it open
  updateCart();
  openCart();
}

// ================== 5. + AND - BUTTONS ==================
// change is +1 for the "+" button and -1 for the "-" button
function changeQuantity(id, change) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].quantity = cart[i].quantity + change;

      // If the quantity reaches 0, remove this item from the cart
      if (cart[i].quantity === 0) {
        cart.splice(i, 1); // splice(position, 1) removes 1 item at that position
      }
      break; // we found the item, so stop looping
    }
  }
  updateCart();
}

// ================== 6. REDRAW THE CART ==================
function updateCart() {
  let html = "";
  let totalItems = 0;
  let grandTotal = 0;

  // Message shown when nothing is in the cart
  if (cart.length === 0) {
    html = `<p class="text-muted text-center mt-4">Your cart is empty.</p>`;
  }

  // Loop through the cart and build one row per item
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    let subtotal = item.price * item.quantity;

    totalItems = totalItems + item.quantity;
    grandTotal = grandTotal + subtotal;

    html += `
      <div class="d-flex border-bottom pb-3 mb-3">
        <img src="${item.image}" alt="${item.name}" class="rounded me-3 flex-shrink-0"
             style="width: 60px; height: 60px; object-fit: cover;">

        <div class="flex-grow-1">
          <div class="fw-bold">${item.name}</div>
          <div class="small">${formatPrice(item.price)}</div>

          <div class="d-flex align-items-center my-1 small">
            <span class="me-2">Quantity:</span>
            <button class="btn btn-outline-secondary btn-sm py-0" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="border rounded px-2 mx-1">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm py-0" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>

          <div class="d-flex justify-content-between small">
            <span>Subtotal:</span>
            <span class="fw-bold">${formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>`;
  }

  // Show the items, the navbar badge, and the totals
  document.getElementById("cartItems").innerHTML = html;
  document.getElementById("cartBadge").innerHTML = totalItems;
  document.getElementById("cartCount").innerHTML = totalItems;
  document.getElementById("grandTotal").innerHTML = formatPrice(grandTotal);
}

// ================== 7. OPEN THE CART PANEL ==================
function openCart() {
  let cartElement = document.getElementById("cartOffcanvas");

  // Reuse the Bootstrap offcanvas if it exists, otherwise create it once
  let cartPanel = bootstrap.Offcanvas.getInstance(cartElement);
  if (cartPanel === null) {
    cartPanel = new bootstrap.Offcanvas(cartElement);
  }
  cartPanel.show();
}
