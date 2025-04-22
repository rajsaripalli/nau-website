let cart = [];

function addToCart(id, name, price, quantity) {
    // Prevent negative quantity values
    if (quantity < 1) {
        alert("Quantity cannot be less than 1.");
        return;
    }

    // Find if the product is already in the cart
    let product = cart.find(item => item.id === id);

    if (product) {
        // Update quantity if the product is already in the cart
        product.quantity += quantity;
    } else {
        // Add new product to the cart
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: quantity
        });
    }

    // Update the quantity field to reflect the new quantity in the cart
    updateQuantityField(id);

    updateCartSummary();
    updateCartDetails();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartSummary();
    updateCartDetails();
}

function updateCartSummary() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

    document.getElementById("cart-count").textContent = `Cart: ${totalItems} items`;
    document.getElementById("total-price").textContent = `Total: $${totalPrice}`;
}

function updateCartDetails() {
    let cartDetailsList = document.getElementById("cart-details-list");
    cartDetailsList.innerHTML = ""; // Clear the current cart details
    
    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
        
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeFromCart(item.id);
        
        li.appendChild(removeButton);
        cartDetailsList.appendChild(li);
    });
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        let totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);
        alert(`Amount paid. Your total billed amount is $${totalPrice}.`);
    }
}

document.querySelectorAll(".quantity-minus").forEach(button => {
    button.addEventListener("click", (event) => {
        let productId = parseInt(event.target.getAttribute("data-id"));
        let inputElement = document.getElementById(`${event.target.getAttribute('data-name').toLowerCase()}-quantity`);
        let quantity = parseInt(inputElement.value);
        
        if (quantity > 1) {
            inputElement.value = quantity - 1;
            updateProductInCart(productId, inputElement.value);
        }
    });
});

document.querySelectorAll(".quantity-plus").forEach(button => {
    button.addEventListener("click", (event) => {
        let productId = parseInt(event.target.getAttribute("data-id"));
        let inputElement = document.getElementById(`${event.target.getAttribute('data-name').toLowerCase()}-quantity`);
        let quantity = parseInt(inputElement.value);
        inputElement.value = quantity + 1;
        updateProductInCart(productId, inputElement.value);
    });
});

function updateProductInCart(productId, quantity) {
    // Prevent negative quantity values
    if (quantity < 1) {
        alert("Quantity cannot be less than 1.");
        return;
    }

    let product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(quantity);
        updateCartSummary();
        updateCartDetails();
    }
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        let productId = parseInt(event.target.getAttribute("data-id"));
        let productName = event.target.getAttribute("data-name");
        let productPrice = parseFloat(event.target.getAttribute("data-price"));
        let inputElement = document.getElementById(`${productName.toLowerCase()}-quantity`);
        let quantity = parseInt(inputElement.value);

        // Update the input field before adding to cart
        inputElement.value = quantity;
        addToCart(productId, productName, productPrice, quantity);
    });
});

// Update the input field when the quantity of a product in the cart changes
function updateQuantityField(productId) {
    let product = cart.find(item => item.id === productId);
    let inputElement = document.getElementById(`${product.name.toLowerCase()}-quantity`);
    if (inputElement && product) {
        inputElement.value = product.quantity;
    }
}
