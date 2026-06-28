const API = `${API_BASE}/orders`;

// ======================================
// LOAD USER + CART
// ======================================

const user_id = localStorage.getItem("user_id");
const customer_email = localStorage.getItem("email");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!user_id) {

    alert("Please login first.");

    window.location.href = "login.html";

}

if (cart.length === 0) {

    alert("Your cart is empty.");

    window.location.href = "index.html";

}

document.getElementById("customerEmail").value =
customer_email;

// ======================================
// RENDER ORDER
// ======================================

const orderItems =
document.getElementById("orderItems");

let total = 0;

function renderOrder() {

    orderItems.innerHTML = "";

    total = 0;

    cart.forEach(item => {

        const quantity = item.quantity || 1;

        const subtotal =
            Number(item.price) * quantity;

        total += subtotal;

        orderItems.innerHTML += `

<div class="orderItem">

    <img
    src="${item.image}"
    alt="${item.name}">

    <div class="orderInfo">

        <h4>${item.name}</h4>

        <p>

        Qty:
        ${quantity}

        </p>

    </div>

    <strong>

    KES
    ${subtotal.toLocaleString()}

    </strong>

</div>

`;

    });

    document.getElementById("totalPrice").innerHTML =
    total.toLocaleString();

}

renderOrder();

// ======================================
// COPY BUSINESS NUMBER
// ======================================

document
.getElementById("copyBtn")
.onclick = async () => {

    try {

        await navigator.clipboard.writeText(

            document
            .getElementById("businessNumber")
            .innerText

        );

        alert("Business number copied.");

    }

    catch {

        alert("Couldn't copy.");

    }

};

// ======================================
// PLACE ORDER
// ======================================

document
.getElementById("checkoutBtn")
.onclick = async () => {

    const payment_phone =
    document
    .getElementById("paymentPhone")
    .value
    .trim();

    const mpesa_code =
    document
    .getElementById("mpesaCode")
    .value
    .trim()
    .toUpperCase();

    if (!payment_phone || !mpesa_code) {

        alert("Please fill all payment details.");

        return;

    }

    document
    .getElementById("loadingScreen")
    .style.display = "flex";

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id,

                amount: total,

                payment_phone,

                mpesa_code,

                customer_email,

                items: cart

            })

        });

        const result =
        await response.json();

        document
        .getElementById("loadingScreen")
        .style.display = "none";

        if (!response.ok) {

            alert(result.message);

            return;

        }

        localStorage.removeItem("cart");

        alert(

`Order placed successfully!

Tracking ID:

${result.order.tracking_id}

Payment Status:

Pending Verification`

        );

        window.location.href =

        "tracking.html?tracking=" +

        result.order.tracking_id;

    }

    catch (err) {

        console.log(err);

        document
        .getElementById("loadingScreen")
        .style.display = "none";

        alert("Server Error.");

    }

};