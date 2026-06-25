const orders =
JSON.parse(localStorage.getItem("orders"))
|| [];

const latest=orders[orders.length-1];

trackingCard.innerHTML=`

<h2>${latest.id}</h2>

<h3>${latest.tracking}</h3>

<br>

✅ Payment Received

<br><br>

📦 Processing

<br><br>

⬜ Packed

<br><br>

⬜ Shipped

<br><br>

⬜ Delivered

`;