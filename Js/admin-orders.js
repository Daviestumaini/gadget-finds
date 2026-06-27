const API = "http://localhost:5000/api/orders";

const token = localStorage.getItem("admin_access_token");

if (!token) {

    window.location.href = "admin-login.html";

}

const ordersTable = document.getElementById("ordersTable");

document.getElementById("logoutBtn").onclick = () => {

    localStorage.clear();

    window.location.href = "admin-login.html";

};

// ==============================================
// LOAD ORDERS
// ==============================================

async function loadOrders() {

    const response = await fetch(API, {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    if (!response.ok) {

        alert("Unable to load orders.");

        return;

    }

    const orders = await response.json();

    let html = "";

    orders.forEach(order => {

        let paymentColor = "#f39c12";

        if (order.payment_status === "Verified")
            paymentColor = "#27ae60";

        if (order.payment_status === "Rejected")
            paymentColor = "#e74c3c";

        html += `

<tr>

<td>${order.tracking_id}</td>

<td>${order.customer_email}</td>

<td>${order.payment_phone ?? "-"}</td>

<td>${order.mpesa_code}</td>

<td>KES ${Number(order.amount).toLocaleString()}</td>

<td>

<span style="
padding:6px 12px;
border-radius:20px;
color:white;
background:${paymentColor};
">

${order.payment_status}

</span>

</td>

<td>

<select onchange="updateShipment('${order.id}',this.value)">

<option value="Pending" ${order.shipment_status==="Pending"?"selected":""}>Pending</option>

<option value="Processing" ${order.shipment_status==="Processing"?"selected":""}>Processing</option>

<option value="Shipped" ${order.shipment_status==="Shipped"?"selected":""}>Shipped</option>

<option value="Delivered" ${order.shipment_status==="Delivered"?"selected":""}>Delivered</option>

<option value="Cancelled" ${order.shipment_status==="Cancelled"?"selected":""}>Cancelled</option>

</select>

</td>

<td>

<button onclick="verifyPayment('${order.id}')">

Verify

</button>

<button onclick="rejectPayment('${order.id}')">

Reject

</button>

<button onclick="deleteOrder('${order.id}')">

Delete

</button>

</td>

</tr>

`;

    });

    ordersTable.innerHTML = html;

}

// ==============================================
// VERIFY PAYMENT
// ==============================================

window.verifyPayment = async (id) => {

    const response = await fetch(

        `${API}/verify/${id}`,

        {

            method: "PUT",

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    loadOrders();

};

// ==============================================
// REJECT PAYMENT
// ==============================================

window.rejectPayment = async (id) => {

    const response = await fetch(

        `${API}/reject/${id}`,

        {

            method: "PUT",

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    loadOrders();

};

// ==============================================
// UPDATE SHIPMENT
// ==============================================

window.updateShipment = async (id, shipment_status) => {

    const response = await fetch(

        `${API}/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                shipment_status

            })

        }

    );

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    loadOrders();

};

// ==============================================
// DELETE ORDER
// ==============================================

window.deleteOrder = async (id) => {

    if (!confirm("Delete this order?"))

        return;

    const response = await fetch(

        `${API}/${id}`,

        {

            method: "DELETE",

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    loadOrders();

};

loadOrders();

setInterval(loadOrders, 30000);