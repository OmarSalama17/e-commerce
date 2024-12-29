document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

fetch('../html/navbar.html').then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        updateCartCount();
    })

fetch('../html/footer.html').then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })

function updateCartDisplay() {
    const favItemsDiv = document.getElementById('fav-items');
    const favItems = JSON.parse(localStorage.getItem('favItems')) || [];

    favItemsDiv.innerHTML = '';

    if (favItems.length === 0) {
        favItemsDiv.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    } else {
        favItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item', 'd-flex', 'align-items-center', 'mb-3', 'p-3', 'border', 'rounded');

            itemDiv.innerHTML = `
            <button class="btn btn-danger close" onclick="removeFromCart('${item._id}')"><i class="fa fa-times" aria-hidden="true"></i></button>
            <div class="image">
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.title}" class="me-3" " />
                </div>
                <div class="item-details flex-grow-1">
                
                    <h2 class="h5">${item.title}</h2>
                    <div class="price">
                    <p>$${(item.price).toFixed(2)}</p>
                    </div>
                    <div class="quantity">
                    <p>In Stock</p>
                    </div>
                    <button class="add" onclick="addToFav('${item._id}', '${item.title}', ${item.price}, '${item.image}')">ADD TO CART</button>
                    </div>
            `;

            favItemsDiv.appendChild(itemDiv);

        });


    }
}

function clearCart() {
    localStorage.removeItem('favItems');
    updateCartDisplay(); // Update the display
}

function removeFromCart(productId) {
    let favItems = JSON.parse(localStorage.getItem('favItems')) || [];
    favItems = favItems.filter(item => item._id !== productId);
    localStorage.setItem('favItems', JSON.stringify(favItems));
    updateCartDisplay(); // Update the display 
}

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
    updateCartCount();

}

function updateFavDisplay() {
    const favItems = JSON.parse(localStorage.getItem('favItems')) || [];
    const total = favItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // document.getElementById('total-price').innerHTML = `Total Price: $${total.toFixed(2)}`;
}
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;

    // Update the span with the count
}

