let wishlist =
JSON.parse(
localStorage.getItem("wishlist")
)||[];

const container =
document.getElementById(
"wishlistItems"
);

function renderWishlist(){

container.innerHTML="";

if(wishlist.length===0){

container.innerHTML=`

<div class="empty">

<h2>No wishlist items ❤️</h2>

</div>

`;

return;

}

wishlist.forEach(item=>{

container.innerHTML+=`

<div class="card">

<div style="
font-size:5rem;
text-align:center">

${item.emoji}

</div>

<h3>${item.name}</h3>

<div class="price">

KES ${item.price.toLocaleString()}

</div>

<div class="actions">

<button
class="addBtn"
onclick="moveToCart(${item.id})">

Move To Cart

</button>

<button
class="removeBtn"
onclick="removeWish(${item.id})">

Remove

</button>

</div>

</div>

`;

});

}

function moveToCart(id){

let cart=
JSON.parse(
localStorage.getItem("cart")
)||[];

const product=
wishlist.find(
p=>p.id===id
);

cart.push({
...product,
qty:1
});

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

removeWish(id);

}

function removeWish(id){

wishlist=
wishlist.filter(
i=>i.id!==id
);

localStorage.setItem(
"wishlist",
JSON.stringify(
wishlist
));

renderWishlist();

}

renderWishlist();