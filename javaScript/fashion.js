fetch('../html/navbar.html').then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        updateCartCount();
    })

fetch('../html/footer.html').then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })

let currentIndex = 0;
const productsPerPage = 8;
let allProducts = []
let filteredProducts = [];

async function fetchProducts() {
    try {
        // Fetch products from the first API
        const api1 = fetch('https://fakestoreapiserver.reactbd.com/smart').then(res => res.json());

        // Fetch products from the second API
        const api2 = fetch('https://fakestoreapiserver.reactbd.com/tech').then(res => res.json())

        //Fetch products from the third API
        const api3 = fetch('https://fakestoreapiserver.reactbd.com/next').then(res => res.json())
        // Wait for both requests to resolve
        const [response1, response2, response3] = await Promise.all([api1, api2, api3]);

        const combinedProducts = [...response1, ...response2, ...response3];

        const targetCategories = ["Fashion", "Bracelets", "Shoes"];

        const filteredProducts = combinedProducts.filter(product =>
            targetCategories.includes(product.category)
        );

        allProducts = filteredProducts
        setupSearch(); 

        return filteredProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

fetchProducts().then((products) => {

    getAllProducts(products);
    addClickEvents(products);
    buyButton(products);

}).catch((error) => {
    console.error('Failed to fetch products:', error);
});


const getAllProducts = function (products) {
    const container = document.querySelector("#productsContainer")

    const productsToShow = (filteredProducts.length > 0 ? filteredProducts : products).slice(0, currentIndex + productsPerPage);
    container.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add('product')

        productCard.innerHTML = `
        <div class="image">
        <img src="${product.image}" class=" productClick " data-id="${product._id}" alt="${product.title}">
        </div>
        <div class="text">
            <h5 class="card-title productClick" data-id="${product._id}">${product.title}</h5>
                <div class="icons">
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star-half-alt star"></i>
                </div>
            <div class="price">$${product.price}
            </div>
            <div class="options">
            <div class="add-to-card">
                    <button  onclick="addToCart('${product._id}', '${product.title}', ${product.price}, '${product.image}')"><i class="fa-solid fa-cart-shopping i"></i></button>
            </div>
                <div class="add-to-fav">
                    <button  onclick="addToFav('${product._id}', '${product.title}', ${product.price}, '${product.image}')"><i class="fa-solid fa-heart i"></i></button>                
                </div>
            </div>
        </div>
    `
        container.appendChild(productCard)

    });

    if (currentIndex + productsPerPage >= (filteredProducts.length > 0 ? filteredProducts.length : products.length)) {
        document.getElementById("seeMoreButton").style.display = "none";
    } else {
        document.getElementById("seeMoreButton").style.display = "block";
    }
}



const addClickEvents = function (products) {
    const clickAbleEvents = document.querySelectorAll('.productClick');

    clickAbleEvents.forEach(element => {
        element.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const selectedProduct = products.find(product => product._id == productId);
            // console.log(selectedProduct)
            displayProductDetails(selectedProduct);
        })
    })
}

const displayProductDetails = function (selectedProduct) {

    document.getElementById("modalProductImage").src = selectedProduct.image;
    document.getElementById("modalProductTitle").innerText = selectedProduct.title;
    // document.getElementById("modalProductDescription").innerText = selectedProduct.description;
    document.getElementById("modalProductPrice").innerText = selectedProduct.price;
    document.getElementById("modalProductOldPrice").innerText = selectedProduct.oldPrice;
    document.getElementById("modalProductQuantity").innerText = selectedProduct.quantity;
    document.getElementById("modalProductRating").innerText = selectedProduct.rating;
    document.getElementById("modalProductCategory").innerText = selectedProduct.category;
    document.getElementById("buy").innerHTML =
        `
    <button type="button" class="btn btn-primary buy" onclick="addToCart('${selectedProduct._id}', '${selectedProduct.title}', ${selectedProduct.price}, '${selectedProduct.image}')">BUY</button>;
    `
    document.getElementById("cart").innerHTML =
        `
    <button style="width:50px; margin-bottom:5px;" onclick="addToCart('${selectedProduct._id}', '${selectedProduct.title}', ${selectedProduct.price}, '${selectedProduct.image}')"><i class="fa-solid fa-cart-shopping i"></i></button>
    `
    document.getElementById("fav").innerHTML =
        `
    <button style="width:50px;" onclick="addToFav('${selectedProduct._id}', '${selectedProduct.title}', ${selectedProduct.price}, '${selectedProduct.image}')"><i class="fa-solid fa-heart i"></i></button>
    `

    const productModel = new bootstrap.Modal(document.getElementById('productModal'))
    productModel.show();
}

document.getElementById("seeMoreButton").addEventListener('click', function () {
    currentIndex += productsPerPage; 
    getAllProducts(filteredProducts.length > 0 ? filteredProducts : allProducts); 
    addClickEvents(filteredProducts.length > 0 ? filteredProducts : allProducts); 
});

//sending product data to cart
function addToCart(productId, productName, productPrice, productImage) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existingItemIndex = cartItems.findIndex(item => item._id === productId);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        const newItem = { _id: productId, title: productName, price: productPrice, quantity: 1, image: productImage };
        cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    updateCartDisplay();
}
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;

    // Update the span with the count
}

function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // document.getElementById('total-price').innerHTML = `Total Price: $${total.toFixed(2)}`;
}

//sending product data to fav
function addToFav(productId, productName, productPrice, productImage) {
    const favItems = JSON.parse(localStorage.getItem('favItems')) || [];

    const existingItemIndex = favItems.findIndex(item => item._id === productId);

    if (existingItemIndex > -1) {
        favItems[existingItemIndex].quantity += 1;
    } else {
        const newItem = { _id: productId, title: productName, price: productPrice, quantity: 1, image: productImage };
        favItems.push(newItem);
    }

    localStorage.setItem('favItems', JSON.stringify(favItems));
    updateFavDisplay();
}

function updateFavDisplay() {
    const favItems = JSON.parse(localStorage.getItem('favItems')) || [];
    const total = favItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // document.getElementById('total-price').innerHTML = `Total Price: $${total.toFixed(2)}`;
}
const setupSearch = function () {
    const searchInput = document.getElementById("search");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchQuery = this.value.toLowerCase();

            if (searchQuery === '') {
                currentIndex = 0; 
                filteredProducts = []; 
                getAllProducts(allProducts); 
            } else {
                filteredProducts = allProducts.filter(product =>
                    product.title.toLowerCase().includes(searchQuery)
                );

                currentIndex = 0; 
                getAllProducts(filteredProducts); 
            }
        });
    }
};