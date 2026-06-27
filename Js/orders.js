"use strict";

// ========================================
// Gadget Finds - My Orders
// ========================================

const API_URL = "http://localhost:5000/api/orders/user";

const userId = localStorage.getItem("user_id");

if (!userId) {
    window.location.href = "login.html";
}

const totalOrders = document.getElementById("totalOrders");
const inTransit = document.getElementById("inTransit");
const delivered = document.getElementById("delivered");
const ordersList = document.getElementById("ordersList");

async function loadOrders() {

    try {

        const response = await fetch(`${API_URL}/${userId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load orders.");
        }

        const orders = result.orders || result;

        totalOrders.textContent = orders.length;

        inTransit.textContent =
            orders.filter(order =>
                order.shipment_status === "In Transit"
            ).length;

        delivered.textContent =
            orders.filter(order =>
                order.shipment_status === "Delivered"
            ).length;

        ordersList.innerHTML = "";

        if (orders.length === 0) {

            ordersList.innerHTML = `
                <div class="empty-orders">
                    <h3>No orders yet.</h3>
                    <p>Your orders will appear here after checkout.</p>
                </div>
            `;

            return;
        }

        orders.forEach(order => {

            ordersList.innerHTML += `

            <div class="order-card">

                <h3>Order #${order.order_id || order.id}</h3>

                <p>
                    <strong>Tracking:</strong>
                    ${order.tracking_id}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${order.payment_status}
                </p>

                <p>
                    <strong>Shipment:</strong>
                    ${order.shipment_status}
                </p>

                <p>
                    <strong>Total:</strong>
                    KES ${Number(order.amount || order.total || 0).toLocaleString()}
                </p>

                <button
                    onclick="trackOrder('${order.tracking_id}')">
                    Track Order
                </button>

            </div>

            <hr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        ordersList.innerHTML = `
            <p>Unable to load your orders.</p>
        `;

    }

}

function trackOrder(trackingId) {

    localStorage.setItem(
        "tracking_id",
        trackingId
    );

    window.location.href = "track.html";

}

loadOrders();