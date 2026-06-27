const API = "http://localhost:5000/api/products";

const token = localStorage.getItem("admin_access_token");

const welcome = document.getElementById("welcome");
const productCount = document.getElementById("productCount");
const productsTable = document.getElementById("productsTable");

const modal = document.getElementById("productModal");

const modalTitle = document.getElementById("modalTitle");

const saveBtn = document.getElementById("saveProductBtn");

const closeBtn = document.getElementById("closeModal");

const addBtn = document.getElementById("addProductBtn");

const logoutBtn = document.getElementById("logoutBtn");

const nameInput = document.getElementById("productName");

const priceInput = document.getElementById("productPrice");

const imageInput = document.getElementById("productImage");

const categoryInput = document.getElementById("productCategory");

const ratingInput = document.getElementById("productRating");

const deliveryInput = document.getElementById("productDelivery");

let editingId = null;

welcome.innerHTML =
"Welcome, " + localStorage.getItem("admin_name");

logoutBtn.onclick = () => {

localStorage.removeItem("admin_access_token");

localStorage.removeItem("admin_name");

localStorage.removeItem("admin_role");

localStorage.removeItem("admin_id");

window.location.href="admin-login.html";

};

addBtn.onclick = () => {

editingId = null;

modalTitle.innerHTML="Add Product";

nameInput.value="";

priceInput.value="";

imageInput.value="";

categoryInput.value="";

ratingInput.value="";

deliveryInput.value="";

modal.classList.add("show");

};

closeBtn.onclick=()=>{

modal.classList.remove("show");

};

async function loadProducts(){

const response = await fetch(API);

const products = await response.json();

productCount.innerHTML = products.length;

let html = "";

products.forEach(product=>{

html += `

<tr>

<td>

<img src="${product.image}">

</td>

<td>

${product.name}

</td>

<td>

KES ${Number(product.price).toLocaleString()}

</td>

<td>

${product.category}

</td>

<td>

<button onclick="editProduct('${product.id}')">

Edit

</button>

<button onclick="deleteProduct('${product.id}')">

Delete

</button>

</td>

</tr>

`;

});

productsTable.innerHTML = html;

window.products = products;

}

loadProducts();
// ======================================================
// SAVE PRODUCT
// ======================================================

saveBtn.onclick = async () => {

    const product = {

        name: nameInput.value.trim(),
        price: Number(priceInput.value),
        image: imageInput.value.trim(),
        category: categoryInput.value.trim(),
        rating: Number(ratingInput.value),
        delivery: deliveryInput.value.trim()

    };

    if (
        !product.name ||
        !product.price ||
        !product.image ||
        !product.category
    ) {

        alert("Please fill all required fields.");

        return;

    }

    const url = editingId
        ? `${API}/${editingId}`
        : API;

    const method = editingId
        ? "PUT"
        : "POST";

    const response = await fetch(url, {

        method,

        headers: {

            "Content-Type": "application/json",

            "Authorization":
                "Bearer " + token

        },

        body: JSON.stringify(product)

    });

    const result = await response.json();

    if (!response.ok) {

        alert(result.message || "Failed");

        return;

    }

    modal.classList.remove("show");

    loadProducts();

};

// ======================================================
// EDIT PRODUCT
// ======================================================

window.editProduct = function(id){

    const product =
        window.products.find(p=>p.id===id);

    if(!product) return;

    editingId = id;

    modalTitle.innerHTML = "Edit Product";

    nameInput.value = product.name;

    priceInput.value = product.price;

    imageInput.value = product.image;

    categoryInput.value = product.category;

    ratingInput.value = product.rating;

    deliveryInput.value = product.delivery;

    modal.classList.add("show");

};
// ======================================================
// DELETE PRODUCT
// ======================================================

window.deleteProduct = async function(id){

    const confirmDelete = confirm(
        "Delete this product?"
    );

    if(!confirmDelete) return;

    const response = await fetch(`${API}/${id}`,{

        method:"DELETE",

        headers:{

            "Authorization":
            "Bearer " + token

        }

    });

    const result = await response.json();

    if(!response.ok){

        alert(result.message || "Delete failed.");

        return;

    }

    loadProducts();

};

// ======================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================================

window.onclick = function(e){

    if(e.target === modal){

        modal.classList.remove("show");

    }

};

// ======================================================
// ESC KEY CLOSES MODAL
// ======================================================

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        modal.classList.remove("show");

    }

});

// ======================================================
// ENTER KEY SAVES PRODUCT
// ======================================================

document.addEventListener("keydown",e=>{

    if(e.key==="Enter" && modal.classList.contains("show")){

        saveBtn.click();

    }

});

// ======================================================
// AUTO REFRESH EVERY 30 SECONDS
// ======================================================

setInterval(loadProducts,30000);