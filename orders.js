let orders =
JSON.parse(
localStorage.getItem("orders")
)||[];

const ordersList =
document.getElementById(
"ordersList"
);

function renderOrders(){

ordersList.innerHTML="";

if(orders.length===0){

ordersList.innerHTML=`

<div class="empty">

<h2>No Orders Yet 📦</h2>

<p>Start shopping!</p>

</div>

`;

return;

}

orders.reverse().forEach(order=>{

ordersList.innerHTML += `

<div class="card">

<div class="orderTop">

<h2>${order.id}</h2>

<span class="status">

${order.status}

</span>

</div>

<p>

Tracking:

<strong>

${order.tracking}

</strong>

</p>

<p>

Payment Code:

${order.paymentCode}

</p>

<p>

Ordered:

${new Date(order.date)
.toLocaleDateString()}

</p>

<div class="actions">

<button
class="trackBtn"
onclick="trackOrder(
'${order.tracking}'
)">

Track Package

</button>

<button
class="receiptBtn"
onclick="viewReceipt(
'${order.id}'
)">

Receipt

</button>

</div>

</div>

`;

});

}

function trackOrder(code){

localStorage.setItem(
"currentTracking",
code
);

window.location =
"track.html";

}

function viewReceipt(id){

localStorage.setItem(
"currentReceipt",
id
);

window.location =
"receipt.html";

}

renderOrders();