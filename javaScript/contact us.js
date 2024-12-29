fetch('../html/navbar.html').then(res => res.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        updateCartCount();
    })
    fetch('../html/footer.html').then(res => res.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').innerText = cartCount;
    
        // Update the span with the count
    }
