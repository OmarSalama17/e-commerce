window.addEventListener('DOMContentLoaded', (event) => {
  updateCartCount();
});
const target = new Date("Feb 29, 2025 23:59:59").getTime();

let countdown = setInterval(function () {
  let now = new Date().getTime();
  let distance = target - now;
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
  if (distance < 0) {
    clearInterval(countdown);
    document.getElementById("days").innerHTML = "0";
    document.getElementById("hours").innerHTML = "0";
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "0";
    
  }
}, 1000);

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').innerText = cartCount;

  // Update the span with the count
}
