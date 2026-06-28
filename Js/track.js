const API = `${API_BASE}/orders`;

// =========================================
// GET QUERY PARAMETER
// =========================================

const params = new URLSearchParams(window.location.search);

const trackingFromURL = params.get("tracking");

const trackingInput = document.getElementById("trackingInput");

if (trackingFromURL) {

    trackingInput.value = trackingFromURL;

    trackOrder();

}

// =========================================
// TRACK BUTTON
// =========================================

document.getElementById("trackBtn").onclick = () => {

    trackOrder();

};

// =========================================
// TRACK ORDER
// =========================================

async function trackOrder() {

    const trackingID = trackingInput.value.trim().toUpperCase();

    if (!trackingID) {

        alert("Please enter a Tracking ID.");

        return;

    }

    try {

        const response = await fetch(

            `${API}/${trackingID}`

        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.message);

            document.getElementById("result").style.display = "none";

            return;

        }

        const order = result.order;

        document.getElementById("result").style.display = "block";

        document.getElementById("trackingID").innerHTML =
            order.tracking_id;

        document.getElementById("paymentStatus").innerHTML =
            order.payment_status;

        document.getElementById("shipmentStatus").innerHTML =
            order.shipment_status;

        document.getElementById("amount").innerHTML =
            Number(order.amount).toLocaleString();

        document.getElementById("customerEmail").innerHTML =
            order.customer_email;

        // Optional status colors

        const paymentStatus =
            document.getElementById("paymentStatus");

        switch (order.payment_status) {

            case "Verified":

                paymentStatus.style.color = "green";

                break;

            case "Rejected":

                paymentStatus.style.color = "red";

                break;

            default:

                paymentStatus.style.color = "orange";

        }

        const shipment =
            document.getElementById("shipmentStatus");

        switch (order.shipment_status) {

            case "Delivered":

                shipment.style.color = "green";

                break;

            case "Cancelled":

                shipment.style.color = "red";

                break;

            default:

                shipment.style.color = "#2563eb";

        }

    }

    catch (err) {

        console.log(err);

        alert("Server Error.");

    }

};