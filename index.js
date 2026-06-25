const products = [
{
id:1,
name:"iPhone 15 Pro",
price:189000,
image: ".images/iPhone 15 Pro.jpeg",
category:"Phones"
},
{
id:2,
name:"PS5 Slim",
price:75000,
emoji:"🎮",
category:"Gaming"
},

{
id:3,
name:"Galaxy S24 Ultra",
price:165000,
emoji:"📲",
category:"Phones"
}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsDiv = document.getElementById("products");
const cartBtn = document.getElementById("cartBtn");
const drawer = document.getElementById("drawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

function showToast(msg){

toast.innerText = msg;
toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},2000);

}

function saveCart(){
localStorage.setItem("cart",JSON.stringify(cart));
}

function renderProducts(list=products){

productsDiv.innerHTML="";

list.forEach(product=>{

productsDiv.innerHTML+=`

<div class="card">

<div style="font-size:5rem;text-align:center">
<img src="${product.image}">
</div>

<h3>${product.name}</h3>

<div class="price">
KES ${product.price.toLocaleString()}
</div>

<button class="addBtn"
onclick="addToCart(${product.id})">

Add To Cart

</button>

</div>

`;

});

}

function addToCart(id){

const item = products.find(p=>p.id===id);

const exists = cart.find(i=>i.id===id);

if(exists){

exists.qty++;

}else{

cart.push({...item,qty:1});

}

saveCart();
renderCart();
showToast("Added to cart");

}

function renderCart(){

cartItems.innerHTML="";

let total=0;

cart.forEach(item=>{

total+=item.price*item.qty;

cartItems.innerHTML+=`

<div class="cartItem">

<h4>${item.emoji} ${item.name}</h4>

<p>KES ${(item.price*item.qty).toLocaleString()}</p>

<div>

<button onclick="decrease(${item.id})">−</button>

${item.qty}

<button onclick="increase(${item.id})">+</button>

</div>

</div>

`;

});

totalPrice.innerText=total.toLocaleString();

cartCount.innerText=
cart.reduce((sum,item)=>sum+item.qty,0);

}

function increase(id){

cart.find(i=>i.id===id).qty++;

saveCart();

renderCart();

}

function decrease(id){

const item = cart.find(i=>i.id===id);

item.qty--;

if(item.qty<=0){

cart = cart.filter(i=>i.id!==id);

}

saveCart();

renderCart();

}

cartBtn.onclick=()=>{

drawer.classList.add("show");

}

closeCart.onclick=()=>{

drawer.classList.remove("show");

}

document
.getElementById("searchInput")
.addEventListener("keyup",e=>{

const keyword=e.target.value.toLowerCase();

const filtered=products.filter(product=>

product.name.toLowerCase().includes(keyword)

);

renderProducts(filtered);

});

document
.getElementById("themeBtn")
.onclick=()=>{

document.body.classList.toggle("dark");

};

renderProducts();

renderCart();

let user =
JSON.parse(localStorage.getItem("user"))
|| null;

const authModal =
document.getElementById("authModal");

document.querySelector(".checkoutBtn")
.onclick=()=>{

if(cart.length===0)return;

if(!user){

authModal.classList.add("show");

}else{

paymentModal.classList.add("show");

}

};

loginBtn.onclick=()=>{

user={

name:username.value,

email:email.value

};

localStorage.setItem(
"user",
JSON.stringify(user)
);

authModal.classList.remove("show");

paymentModal.classList.add("show");

showToast("Welcome "+user.name);

};

const paymentModal =
document.getElementById("paymentModal");

confirmPayment.onclick=()=>{

if(mpesaCode.value==""){

showToast("Enter transaction code");

return;

}

const order={

id:"GF"+Date.now(),

tracking:"TRK"+Date.now(),

items:cart,

status:"Processing",

paymentCode:mpesaCode.value,

date:new Date()

};

let orders=

JSON.parse(
localStorage.getItem("orders")
)||[];

orders.push(order);

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

cart=[];

saveCart();

renderCart();

paymentSheet.classList.add("show");

sheetAmount.innerText =
totalPrice.innerText;

showToast("Order successful!");

setTimeout(()=>{

window.location="track.html";

},1000);

};

let wishlist =
JSON.parse(
localStorage.getItem("wishlist")
)||[];

function addWishlist(id){

const item=products.find(
p=>p.id===id
);

if(
!wishlist.find(i=>i.id===id)
){

wishlist.push(item);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

showToast(
"Added to wishlist ❤"
);

}

};

copyBtn.onclick=()=>{

navigator.clipboard.writeText(
"0712345678"
);

showToast(
"Number copied"
);

};

confirmPayment.onclick=()=>{

if(mpesaCode.value===""){

showToast(
"Enter transaction code"
);

return;

}

const order={

id:"GF"+Date.now(),

tracking:"TRK"+Date.now(),

items:cart,

paymentCode:mpesaCode.value,

status:"Processing"

};

let orders=

JSON.parse(
localStorage.getItem("orders")
)||[];

orders.push(order);

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

showToast(
"Payment received!"
);

paymentSheet.classList.remove(
"show"
);

};