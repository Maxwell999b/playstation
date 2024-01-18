// Update the addToCart function
function addToCart(title, price, thumbnail) {
    var cartList = document.querySelector('.cart-list');
    var existingCartItem = cartList.querySelector(`.cart-item[data-title="${title}"]`);

    if (existingCartItem) {
        var quantityElement = existingCartItem.querySelector('.cart-item-quantity');
        var quantity = parseInt(quantityElement.value);

        if (quantity < 100) {
            quantityElement.value = Math.min(quantity + 1, 100);
        }
    } else {
        // Generate a unique identifier for the product (you may use a more robust method)
        var productId = title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();

        addItemToCart(cartList, title, price, thumbnail, productId);
    }

    // Trigger a custom event when quantity changes
    dispatchQuantityChangeEvent();

    updateTotalPrice();
}




function addItemToCart(cartList, title, price, thumbnail, productId) {
    var cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-title', title);
    cartItem.setAttribute('data-id', productId); // Add product ID attribute

    var thumbnailElement = new Image();
    thumbnailElement.src = new URL(thumbnail, window.location.href).href; // Use absolute path
    thumbnailElement.alt = title;
    thumbnailElement.classList.add('cart-item-thumbnail');

    var cartItemDetails = document.createElement('div');
    cartItemDetails.classList.add('cart-item-details');
    cartItemDetails.innerHTML = `
        <p class="cart-item-title">${title}</p>
        <p class="cart-item-price">${price}</p>
        <div class="cart-item-actions">
            <button class="btn btn-sm btn-outline-secondary" onclick="decrementCartItem(this)">-</button>
            <input class="cart-item-quantity" type="number" value="1" min="1" max="100" oninput="validateQuantity(this)">
            <button class="btn btn-sm btn-outline-success" onclick="incrementCartItem(this)">+</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCartItem(this)"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    cartItem.appendChild(thumbnailElement);
    cartItem.appendChild(cartItemDetails);

    cartList.appendChild(cartItem);
}

function validateQuantity(input) {
    var value = parseInt(input.value);

    // Ensure the value is a number and not empty
    if (isNaN(value) || value <= 0) {
        input.value = 1;
    } else {
        // Ensure the value does not exceed the limit (100)
        input.value = Math.min(value, 100);
    }

    // Update the total value
    updateTotalPrice();
}

// Listen for the custom event
document.addEventListener('cartUpdated', updateTotalPrice);

// Update the total value
function updateTotalPrice() {
    var totalPriceElement = document.getElementById('cart-total-value');

    if (totalPriceElement) {
        var totalPrice = calculateTotalPrice();
        totalPriceElement.textContent = 'Total is: ' + (totalPrice !== undefined ? formatNumberWithCommas(totalPrice.toFixed(2)) : '');
    }
}

// Function to format a number with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Listen for the custom event
document.addEventListener('cartUpdated', updateTotalPrice);

function removeCartItem(button) {
    var cartItem = button.closest('.cart-item');
    var quantityElement = cartItem.querySelector('.cart-item-quantity');
    var quantity = parseInt(quantityElement.textContent);

    if (quantity > 1) {
        // If quantity is more than 1, decrement it
        quantityElement.textContent = quantity - 1;
    } else {
        // If quantity is 1, remove the entire cart item
        cartItem.remove();
    }

    // Update the total value
    var totalPrice = calculateTotalPrice();
    document.getElementById('cart-total-value').textContent = totalPrice.toFixed(2);
}

function addCartItem(button) {
    var quantityElement = button.previousElementSibling;
    var quantity = parseInt(quantityElement.textContent);

    // Increment the quantity
    quantityElement.textContent = quantity + 1;

    // Update the total value
    var totalPrice = calculateTotalPrice();
    document.getElementById('cart-total-value').textContent = totalPrice.toFixed(2);
}

function deleteCartItem(button) {
    var cartItem = button.closest('.cart-item');
    cartItem.remove();

    // Update the total value
    updateTotalPrice();

    // Trigger a custom event to notify the cart is updated
    var event = new Event('cartUpdated');
    document.dispatchEvent(event);

    // Update the cart badge count
    updateCartBadgeCount();
}


// Update the incrementCartItem function
function incrementCartItem(button) {
    var quantityInput = button.parentElement.querySelector('.cart-item-quantity');
    var quantity = parseInt(quantityInput.value);

    // Increment the quantity, but ensure it does not exceed the limit (10000)
    quantityInput.value = Math.min(quantity + 1, 100);

    // Dispatch custom event when quantity is changed
    dispatchQuantityChangeEvent();

    // Update the total value
    updateTotalPrice();
}

// Update the decrementCartItem function
function decrementCartItem(button) {
    var quantityInput = button.parentElement.querySelector('.cart-item-quantity');
    var quantity = parseInt(quantityInput.value);

    if (quantity > 1) {
        // If quantity is more than 1, decrement it
        quantityInput.value = quantity - 1;

        // Dispatch custom event when quantity is changed
        dispatchQuantityChangeEvent();
    }

    // Update the total value
    updateTotalPrice();
}

// Function to dispatch custom event when quantity changes
function dispatchQuantityChangeEvent() {
    var event = new Event('quantityChanged');
    document.dispatchEvent(event);
}

// Listen for the custom event and update the cart badge count
document.addEventListener('quantityChanged', updateCartBadgeCount);



var debouncedUpdateTotalPrice;

function calculateTotalPrice() {
    var cartItems = document.querySelectorAll('.cart-item');
    var total = 0;

    cartItems.forEach(function (cartItem) {
        var priceElement = cartItem.querySelector('.cart-item-price');
        var quantityInput = cartItem.querySelector('.cart-item-quantity');

        if (priceElement && quantityInput) {
            var price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, '')); // Remove non-numeric characters
            var quantity = parseInt(quantityInput.value);

            if (!isNaN(price) && !isNaN(quantity)) {
                total += price * quantity;
            }
        }
    });

    return total;
}

// Initial setup to update the total price on page load
document.addEventListener('DOMContentLoaded', updateTotalPrice);


function showBuyAlert() {
    // Check if there are items in the cart
    var cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length > 0) {
        // Show the alert
        var buyAlert = document.getElementById('buyAlert');
        buyAlert.style.display = 'block';

        // Reload the page after a delay
        setTimeout(function () {
            location.reload();
        }, 2500); // 3000 milliseconds (3 seconds) delay before reload

        // Clear the cart modal
        setTimeout(function () {
            clearCartModal();
        }, 500);
    }
}

// Modify the clearCartModal function to update the visibility of the BUY button
// Modify the clearCartModal function to update the visibility of the BUY button
function clearCartModal() {
    var cartList = document.querySelector('.cart-list');
    cartList.innerHTML = ''; // Clear the cart items

    // Trigger a custom event to notify the offcanvas script
    var event = new Event('cartUpdated');
    document.dispatchEvent(event);

    // Update the total value if #cart-total-value element is present
    var totalPriceElement = document.getElementById('cart-total-value');
    if (totalPriceElement) {
        updateTotalPrice();
    }

    // Check if the BUY button should be visible
    var buyButton = document.querySelector('.BUY-btn');
    buyButton.style.display = cartList.hasChildNodes() ? 'inline-block' : 'none';
}

// Initial setup to hide the BUY button
document.addEventListener('DOMContentLoaded', function () {
    var buyButton = document.querySelector('.BUY-btn');
    buyButton.style.display = 'none';
});

// Update the visibility of the BUY button when the cart is updated
document.addEventListener('cartUpdated', function () {
    var cartList = document.querySelector('.cart-list');
    var buyButton = document.querySelector('.BUY-btn');
    buyButton.style.display = cartList.hasChildNodes() ? 'inline-block' : 'none';
});

document.addEventListener('DOMContentLoaded', function () {
    // Initial setup to update the total price on page load
    updateTotalPrice();

    // Add other necessary setup or initialization code here
});


// Update the cart badge count for each item
function updateCartBadgeCount() {
    var cartItems = document.querySelectorAll('.cart-item');
    var totalQuantity = 0;

    cartItems.forEach(function (cartItem) {
        var quantityInput = cartItem.querySelector('.cart-item-quantity');
        var quantity = parseInt(quantityInput.value);

        if (!isNaN(quantity)) {
            totalQuantity += quantity;
        }
    });

    updateCartBadge(totalQuantity);
}

// Add this function to update the cart badge
function updateCartBadge(count) {
    var badgeElement = document.getElementById('cart-badge');
    if (badgeElement) {
        badgeElement.textContent = count;
        badgeElement.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Listen for the custom event
document.addEventListener('cartUpdated', function () {
    var cartItems = document.querySelectorAll('.cart-item');
    var cartItemCount = cartItems.length;
    updateCartBadge(cartItemCount);
});

// Initial setup to update the cart badge count on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCartBadgeCount();
});

// Add this line to hide the BUY button initially if the cart is empty
clearCartModal();

// Add this function to check the visibility of the BUY button
function checkBuyButtonVisibility() {
    var cartList = document.querySelector('.cart-list');
    var buyButton = document.querySelector('.BUY-btn');
    buyButton.style.display = cartList.hasChildNodes() ? 'inline-block' : 'none';
}

// Update the visibility of the BUY button when the cart is updated
document.addEventListener('cartUpdated', function () {
    checkBuyButtonVisibility();
});

// Add this line to hide the BUY button initially if the cart is empty
document.addEventListener('DOMContentLoaded', function () {
    var buyButton = document.querySelector('.BUY-btn');
    buyButton.style.display = 'none';
});

// Initial setup to update the cart badge count on page load
document.addEventListener('DOMContentLoaded', function () {
    var cartItems = document.querySelectorAll('.cart-item');
    var cartItemCount = cartItems.length;
    updateCartBadge(cartItemCount);
});

// Add an event listener for the input event on quantity inputs
document.addEventListener('input', function (event) {
    if (event.target.classList.contains('cart-item-quantity')) {
        // Dispatch a custom event when quantity is changed
        dispatchQuantityChangeEvent();
    }
});
// ... (rest of your existing script)

updateCartBadgeCount();  

// function showBuyToast() {
//     // Trigger the toast
//     var toast = new bootstrap.Toast(document.getElementById('buyToast'));
//     toast.show();

//     // Close the cart modal
//     $('#offcanvasLeftBothOptions').offcanvas('hide');
// }
