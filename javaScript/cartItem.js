document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

fetch('../html/navbar.html').then(res => res.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        updateCartCount();
    })

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceDiv = document.getElementById('total-price');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItemsDiv.innerHTML = ''; // Clear previous items
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        totalPriceDiv.innerHTML = 'Total Price: $0.00';
    } else {
        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item', 'd-flex', 'align-items-center', 'mb-3', 'p-3', 'border', 'rounded');

            itemDiv.innerHTML = `
            <div class="image">
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.title}" class="me-3" " />
            </div>
                <div class="item-details flex-grow-1">
                    <div class="name-close">
                        <h2 class="h5">${item.title}</h2>
                        <button class="btn btn-danger close" onclick="removeFromCart('${item._id}')"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <div class="price">
                        <p> <span> Price :</span>$${item.price.toFixed(2)}</p>
                        <p><span>Total:</span> $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="quantity">
                        <div class="quantit-y">
                            <button class="btn btn-secondary btn-1" onclick="decreaseQuantity('${item._id}')">-</button>
                            <p> ${item.quantity}</p>
                            <button class="btn btn-secondary" onclick="increaseQuantity('${item._id}')">+</button>
                        </div>
                    </div>
                </div>
            `;

            cartItemsDiv.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        totalPriceDiv.innerHTML = `Subtotal: $${total.toFixed(2)}`;
    }
}

function clearCart() {
    localStorage.removeItem('cartItems');
    updateCartDisplay();
    location.reload();// Update the display
}

function removeFromCart(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    location.reload();
    // Update the display without reloading
}

function increaseQuantity(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item._id === productId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));// Update the display
        updateCartDisplay();
    }
    location.reload();
}

function decreaseQuantity(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item._id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay(); // Update the display
    } else if (item && item.quantity === 1) {
        removeFromCart(productId);
        // Remove item if quantity is 1
    }
    location.reload();
}
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;

    // Update the span with the count
}

// Call this function to initialize the cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function addToCart(productId, quantity) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item._id === productId);

    if (!existingItem) {
        // Only add to cart if the item does not already exist
        const newItem = { _id: productId, quantity: quantity };
        cartItems.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount(); // Update the cart count only if a new item is added
    }
    location.reload();
}



fetch('../html/footer.html').then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
