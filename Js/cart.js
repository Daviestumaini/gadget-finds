"use strict";

// ========================================
// Gadget Finds - Cart
// ========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// ========================================
// Save Cart
// ========================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ========================================
// Render Cart
// ========================================

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty.</h2>

                <a href="index.html">

                    <button>Continue Shopping</button>

                </a>

            </div>

        `;

        totalPrice.innerText = "0";

        if (checkoutBtn) {

            checkoutBtn.disabled = true;

        }

        return;

    }

    let total = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.qty;

        total += itemTotal;

        cartItems.innerHTML += `

            <div class="cart-card">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="100"
                    onerror="this.src='images/no-image.png'">

                <div>

                    <h3>${item.name}</h3>

                    <p>
                        KES ${item.price.toLocaleString()}
                    </p>

                    <div class="qty-controls">

                        <button
                        onclick="decrease('${item.id}')">

                            −

                        </button>

                        <span>

                            ${item.qty}

                        </span>

                        <button
                        onclick="increase('${item.id}')">

                            +

                        </button>

                    </div>

                    <button
                    onclick="removeItem('${item.id}')">

                        Remove

                    </button>

                </div>

            </div>

            <hr>

        `;

    });

    totalPrice.innerText = total.toLocaleString();

    if (checkoutBtn) {

        checkoutBtn.disabled = false;

    }

}

// ========================================
// Increase Quantity
// ========================================

function increase(id) {

    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.qty++;

    saveCart();

    renderCart();

}

// ========================================
// Decrease Quantity
// ========================================

function decrease(id) {

    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {

        cart = cart.filter(i => i.id !== id);

    }

    saveCart();

    renderCart();

}

// ========================================
// Remove Item
// ========================================

function removeItem(id) {

    if (!confirm("Remove this item from cart?")) {

        return;

    }

    cart = cart.filter(item => item.id !== id);

    saveCart();

    renderCart();

}

// ========================================
// Clear Cart
// ========================================

clearCartBtn?.addEventListener("click", () => {

    if (!confirm("Clear your cart?")) {

        return;

    }

    cart = [];

    saveCart();

    renderCart();

});

// ========================================
// Checkout
// ========================================

checkoutBtn?.addEventListener("click", () => {

    if (cart.length === 0) {

        return;

    }

    window.location.href = "checkout.html";

});

// ========================================
// Init
// ========================================

renderCart();