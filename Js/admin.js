"use strict";

// ========================================
// Gadget Finds Admin Dashboard
// ========================================

const API_URL = "http://localhost:5000/api/products";

const productsDiv = document.getElementById("products");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const categoryInput = document.getElementById("category");
const ratingInput = document.getElementById("rating");
const deliveryInput = document.getElementById("delivery");

const addProductBtn = document.getElementById("addProduct");

// ========================================
// Load Products
// ========================================

async function loadProducts() {

    try {

        const response = await fetch(API_URL);
        const products = await response.json();

        productsDiv.innerHTML = "";

        if (products.length === 0) {

            productsDiv.innerHTML = `
                <h3>No products found.</h3>
            `;

            return;

        }

        products.forEach(product => {

            productsDiv.innerHTML += `

                <div class="admin-card">

                    <img
                        src="${product.image}"
                        width="120"
                        alt="${product.name}"
                        onerror="this.src='images/no-image.png'">

                    <h3>${product.name}</h3>

                    <p>
                        KES ${Number(product.price).toLocaleString()}
                    </p>

                    <p>
                        ${product.category}
                    </p>

                    <button
                        onclick="editProduct('${product.id}')">

                        ✏ Edit

                    </button>

                    <button
                        onclick="deleteProduct('${product.id}')">

                        🗑 Delete

                    </button>

                </div>

                <hr>

            `;

        });

    }

    catch(error){

        console.error(error);

        productsDiv.innerHTML = `
            <h3>Failed to load products.</h3>
        `;

    }

}

// ========================================
// Add Product
// ========================================

addProductBtn.addEventListener("click", async () => {

    const product = {

        name: nameInput.value.trim(),
        price: Number(priceInput.value),
        image: imageInput.value.trim(),
        category: categoryInput.value.trim(),
        rating: Number(ratingInput.value),
        delivery: deliveryInput.value.trim()

    };

    if(

        !product.name ||

        !product.price ||

        !product.image ||

        !product.category

    ){

        alert("Please complete all required fields.");

        return;

    }

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(product)

        });

        const result = await response.json();

        if(result.success){

            alert("Product added successfully.");

            clearForm();

            loadProducts();

        }else{

            alert(result.message || "Failed to add product.");

        }

    }

    catch(error){

        console.error(error);

        alert("Server error.");

    }

});

// ========================================
// Edit Product
// ========================================

async function editProduct(id){

    const name = prompt("Product name");

    if(name === null) return;

    const price = Number(prompt("Price"));

    const image = prompt("Image path");

    const category = prompt("Category");

    const rating = Number(prompt("Rating"));

    const delivery = prompt("Delivery");

    try{

        const response = await fetch(

            `${API_URL}/${id}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    name,
                    price,
                    image,
                    category,
                    rating,
                    delivery

                })

            }

        );

        const result = await response.json();

        if(result.success){

            alert("Product updated.");

            loadProducts();

        }else{

            alert(result.message);

        }

    }

    catch(error){

        console.error(error);

    }

}

// ========================================
// Delete Product
// ========================================

async function deleteProduct(id){

    if(!confirm("Delete this product?")){

        return;

    }

    try{

        const response = await fetch(

            `${API_URL}/${id}`,

            {

                method:"DELETE"

            }

        );

        const result = await response.json();

        alert(result.message);

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert("Failed to delete.");

    }

}

// ========================================
// Helpers
// ========================================

function clearForm(){

    nameInput.value = "";

    priceInput.value = "";

    imageInput.value = "";

    categoryInput.value = "";

    ratingInput.value = "";

    deliveryInput.value = "";

}

// ========================================
// Init
// ========================================

loadProducts();