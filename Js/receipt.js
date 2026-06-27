"use strict";

// ========================================
// Gadget Finds - Receipt
// ========================================

const order = JSON.parse(
    localStorage.getItem("latest_order")
);

const receipt = document.getElementById("receiptInfo");

if (!order) {

    receipt.innerHTML = `
        <h3>No recent order found.</h3>
        <p>Please complete a purchase first.</p>
    `;

} else {

    receipt.innerHTML = `

        <h2>✅ Payment Successful</h2>

        <p>
            <strong>Order ID:</strong><br>
            ${order.order_id || order.id}
        </p>

        <p>
            <strong>Tracking ID:</strong><br>
            ${order.tracking_id || order.tracking}
        </p>

        <p>
            <strong>Payment Status:</strong><br>
            ${order.payment_status || "Paid"}
        </p>

        <p>
            <strong>Shipment Status:</strong><br>
            ${order.shipment_status || "Processing"}
        </p>

        <p>
            <strong>Total Paid:</strong><br>
            KES ${Number(order.total).toLocaleString()}
        </p>

        <p>
            <strong>M-Pesa Code:</strong><br>
            ${order.mpesa_code}
        </p>

    `;

}