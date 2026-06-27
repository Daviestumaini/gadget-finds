const API = "http://localhost:5000/api/orders";

// =======================================
// LOAD USER + CART
// =======================================

const user_id = localStorage.getItem("user_id");
const customer_email = localStorage.getItem("email");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!user_id) {

    alert("Please login first.");

    window.location.href = "login.html";

}

document.getElementById("customerEmail").value = customer_email;

// =======================================
// CALCULATE TOTAL
// =======================================

let total = 0;

cart.forEach(item => {

    total += Number(item.price) * Number(item.quantity);

});

document.getElementById("totalPrice").innerHTML =
total.toLocaleString();

// =======================================
// COMPLETE ORDER
// =======================================

document.getElementById("checkoutBtn").onclick = async () => {

    const payment_phone =
        document.getElementById("paymentPhone").value.trim();

    const mpesa_code =
        document.getElementById("mpesaCode").value.trim().toUpperCase();

    if (!payment_phone || !mpesa_code) {

        alert("Please fill in all payment details.");

        return;

    }

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

        const result = await response.json();

        if (!response.ok) {

            alert(result.message);

            return;

        }

        localStorage.removeItem("cart");

        alert(

`Order Successfully Placed!

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

        alert("Server Error");

    }

};