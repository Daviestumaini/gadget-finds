
"use strict";

// ─── Config ──────────────────────────────────────────────────────────────────
const API = {
    products:"http://localhost:5000/api/products",
    orders:"http://localhost:5000/api/orders",
    auth:"http://localhost:5000/api/auth"
};

// ─── Auth guard ───────────────────────────────────────────────────────────────
const userId = localStorage.getItem("user_id");
if (!userId) window.location.href = "login.html";

// ─── State ────────────────────────────────────────────────────────────────────
let products = [];
let cart     = JSON.parse(localStorage.getItem("cart"))     || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let user     = JSON.parse(localStorage.getItem("user"))     || null;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const DOM = {
  productsGrid:      document.getElementById("products"),
  cartBtn:           document.getElementById("cartBtn"),
  cartDrawer:        document.getElementById("drawer"),
  closeCartBtn:      document.getElementById("closeCart"),
  cartItemsEl:       document.getElementById("cartItems"),
  totalPriceEl:      document.getElementById("totalPrice"),
  cartCountEl:       document.getElementById("cartCount"),
  toast:             document.getElementById("toast"),
  authModal:         document.getElementById("authModal"),
  paymentModal:      document.getElementById("paymentModal"),
  paymentSheet:      document.getElementById("paymentSheet"),
  sheetAmount:       document.getElementById("sheetAmount"),
  mpesaCodeInput:    document.getElementById("mpesaCode"),
  confirmPaymentBtn: document.getElementById("confirmPayment"),
  loginBtn:          document.getElementById("loginBtn"),
  usernameInput:     document.getElementById("username"),
  emailInput:        document.getElementById("email"),
  copyBtn:           document.getElementById("copyBtn"),
  searchInput:       document.getElementById("searchInput"),
  themeBtn:          document.getElementById("themeBtn"),
  checkoutBtn:       document.querySelector(".checkoutBtn"),
  shopNowBtn:        document.querySelector(".hero button"),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg) {
  DOM.toast.innerText = msg;
  DOM.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove("show"), 2500);
}

// ─── Persistence helpers ──────────────────────────────────────────────────────
function saveCart()     { localStorage.setItem("cart",     JSON.stringify(cart));     }
function saveWishlist() { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }

// ─── Product rendering ────────────────────────────────────────────────────────
function renderProducts(list = products) {
  if (!DOM.productsGrid) return;

  if (list.length === 0) {
    DOM.productsGrid.innerHTML = `<p class="empty">No products found.</p>`;
    return;
  }

  DOM.productsGrid.innerHTML = list.map(p => `
    <div class="card">
      <div class="card-img">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">
      </div>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="price">KES ${p.price.toLocaleString()}</div>
      <div class="card-actions">
        <button class="addBtn"  onclick="addToCart('${p.id}')">Add to Cart</button>
        <button class="wishBtn" onclick="toggleWishlist('${p.id}')">
          ${isInWishlist(p.id) ? "♥" : "♡"} Wishlist
        </button>
      </div>
    </div>
  `).join("");
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  existing ? existing.qty++ : cart.push({ ...product, qty: 1 });

  saveCart();
  renderCart();
  showToast(`${product.name} added to cart ✓`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

  saveCart();
  renderCart();
}

function renderCart() {
  if (!DOM.cartItemsEl) return;

  let total = 0;

  if (cart.length === 0) {
    DOM.cartItemsEl.innerHTML = `<p class="empty">Your cart is empty.</p>`;
    DOM.totalPriceEl.innerText = "0";
    DOM.cartCountEl.innerText  = "0";
    return;
  }

  DOM.cartItemsEl.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    return `
      <div class="cartItem">
        <h4>${escapeHtml(item.name)}</h4>
        <p>KES ${lineTotal.toLocaleString()}</p>
        <div class="qty-controls">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.id}',  1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  DOM.totalPriceEl.innerText = total.toLocaleString();
  DOM.cartCountEl.innerText  = cart.reduce((sum, i) => sum + i.qty, 0);
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
function isInWishlist(id) {
  return !!wishlist.find(i => i.id === id);
}

function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  if (isInWishlist(id)) {
    wishlist = wishlist.filter(i => i.id !== id);
    saveWishlist();
    showToast("Removed from wishlist");
  } else {
    wishlist.push(product);
    saveWishlist();
    showToast("Added to wishlist ❤");
  }

  // Refresh card button state
  renderProducts(
    DOM.searchInput.value.trim()
      ? products.filter(p => p.name.toLowerCase().includes(DOM.searchInput.value.toLowerCase()))
      : products
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
function startCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }
  if (!user) {
    DOM.authModal.classList.add("show");
  } else {
    openPaymentModal();
  }
}

function openPaymentModal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (DOM.sheetAmount) DOM.sheetAmount.innerText = total.toLocaleString();
  DOM.paymentModal.classList.add("show");
}

function handleLogin() {
  const name  = DOM.usernameInput.value.trim();
  const email = DOM.emailInput.value.trim();

  if (!name || !email) {
    showToast("Please fill in all fields");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Enter a valid email address");
    return;
  }

  user = { name, email };
  localStorage.setItem("user", JSON.stringify(user));
  DOM.authModal.classList.remove("show");
  showToast(`Welcome, ${user.name}!`);
  openPaymentModal();
}

function confirmPayment() {
  const code = DOM.mpesaCodeInput.value.trim().toUpperCase();

  if (!code) {
    showToast("Enter your M-Pesa transaction code");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = {
    id:          "GF" + Date.now(),
    tracking:    "TRK" + Date.now(),
    items:       [...cart],
    total,
    status:      "Processing",
    paymentCode: code,
    date:        new Date().toISOString(),
  };

await fetch("http://localhost:5000/api/orders",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(order)
});

  cart = [];
  saveCart();
  renderCart();

  DOM.paymentModal.classList.remove("show");
  showToast("Order placed successfully! 🎉");
  setTimeout(() => window.location.href = "track.html", 1800);
}

// ─── Search ───────────────────────────────────────────────────────────────────
function handleSearch(e) {
  const keyword  = e.target.value.trim().toLowerCase();
  const filtered = keyword
    ? products.filter(p => p.name.toLowerCase().includes(keyword))
    : products;
  renderProducts(filtered);
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  DOM.themeBtn.innerText = isDark ? "☀️" : "🌙";
}

function applySavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (DOM.themeBtn) DOM.themeBtn.innerText = "☀️";
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
function bindEvents() {
  DOM.cartBtn?.addEventListener("click",  () => DOM.cartDrawer.classList.add("show"));
  DOM.closeCartBtn?.addEventListener("click", () => DOM.cartDrawer.classList.remove("show"));

  DOM.themeBtn?.addEventListener("click", toggleTheme);

  DOM.shopNowBtn?.addEventListener("click", () => {
    DOM.productsGrid?.scrollIntoView({ behavior: "smooth" });
  });

  DOM.checkoutBtn?.addEventListener("click", startCheckout);

  DOM.loginBtn?.addEventListener("click", handleLogin);

  DOM.confirmPaymentBtn?.addEventListener("click", confirmPayment);

  DOM.copyBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText("0712345678")
      .then(() => showToast("Number copied ✓"))
      .catch(() => showToast("Could not copy. Try manually."));
  });

  DOM.searchInput?.addEventListener("input", handleSearch);

  // Close modals on backdrop click
  [DOM.authModal, DOM.paymentModal].forEach(modal => {
    modal?.addEventListener("click", e => {
      if (e.target === modal) modal.classList.remove("show");
    });
  });
}

// ─── Load products ────────────────────────────────────────────────────────────
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Unexpected response format");

    products = data;
    renderProducts();
  } catch (err) {
    console.error("[Gadget Finds] Failed to load products:", err);
    DOM.productsGrid.innerHTML = `
      <p class="empty">
        Could not load products. Please check your connection and try again.
      </p>
    `;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  applySavedTheme();
  bindEvents();
  renderCart();
  loadProducts();
})();