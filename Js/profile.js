const user =
JSON.parse(
localStorage.getItem("user")
)||{
name:"Guest",
email:"example@email.com"
};

const orders =
JSON.parse(
localStorage.getItem("orders")
)||[];

const wishlist =
JSON.parse(
localStorage.getItem("wishlist")
)||[];

userName.innerText=user.name;

userEmail.innerText=user.email;

orderCount.innerText=
orders.length;

wishlistCount.innerText=
wishlist.length;

document
.querySelector(".logoutBtn")
.onclick=()=>{

localStorage.removeItem(
"user"
);

window.location=
"index.html";

};