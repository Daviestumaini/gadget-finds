let orders =
JSON.parse(
localStorage.getItem(
"orders"
)
)||[];

let currentReceipt =
localStorage.getItem(
"currentReceipt"
);

let receiptOrder =
orders.find(
order=>
order.id===currentReceipt
);

receiptCard.innerHTML=`

<h1>

Gadget Finds

</h1>

<hr>

<h2>

${receiptOrder.id}

</h2>

<p>

Tracking:

${receiptOrder.tracking}

</p>

<p>

Payment Code:

${receiptOrder.paymentCode}

</p>

<p>

Status:

${receiptOrder.status}

</p>

<p>

Date:

${new Date(
receiptOrder.date
).toLocaleString()}

</p>

<hr>

<button
onclick="window.print()"
class="printBtn">

Print Receipt

</button>

`;