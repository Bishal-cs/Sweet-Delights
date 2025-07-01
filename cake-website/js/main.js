// Cake Data
const cakesData = [
    {
        id: 1,
        name: "Chocolate Fudge Cake",
        price: 599,
        category: "chocolate",
        emoji: "🍫",
        description: "Rich chocolate cake with fudge frosting",
        featured: true
    },
    {
        id: 2,
        name: "Vanilla Bean Cake",
        price: 499,
        category: "vanilla",
        emoji: "🍰",
        description: "Classic vanilla cake with creamy buttercream",
        featured: true
    },
    {
        id: 3,
        name: "Strawberry Shortcake",
        price: 649,
        category: "fruit",
        emoji: "🍓",
        description: "Fresh strawberries with whipped cream",
        featured: true
    },
    {
        id: 4,
        name: "Red Velvet Cake",
        price: 699,
        category: "special",
        emoji: "❤️",
        description: "Moist red velvet with cream cheese frosting",
        featured: false
    },
    {
        id: 5,
        name: "Black Forest Cake",
        price: 749,
        category: "chocolate",
        emoji: "🍒",
        description: "Chocolate cake with cherries and whipped cream",
        featured: false
    },
    {
        id: 6,
        name: "Lemon Drizzle Cake",
        price: 549,
        category: "fruit",
        emoji: "🍋",
        description: "Tangy lemon cake with sweet glaze",
        featured: false
    },
    {
        id: 7,
        name: "Carrot Cake",
        price: 599,
        category: "special",
        emoji: "🥕",
        description: "Spiced carrot cake with cream cheese frosting",
        featured: false
    },
    {
        id: 8,
        name: "Tiramisu Cake",
        price: 799,
        category: "special",
        emoji: "☕",
        description: "Coffee-flavored Italian dessert cake",
        featured: false
    },
    {
        id: 9,
        name: "Butterscotch Cake",
        price: 559,
        category: "vanilla",
        emoji: "🧈",
        description: "Rich butterscotch flavor with caramel topping",
        featured: false
    },
    {
        id: 10,
        name: "Pineapple Upside Down",
        price: 629,
        category: "fruit",
        emoji: "🍍",
        description: "Tropical pineapple cake with caramelized fruit",
        featured: false
    }
];

// Cart array to store cart items
let cart = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    loadFeaturedCakes();
    loadAllCakes();
    updateCartCount();
    loadCart();
});

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Load cart items when cart page is shown
    if (pageId === 'cart') {
        displayCartItems();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Load Featured Cakes
function loadFeaturedCakes() {
    const featuredContainer = document.getElementById('featuredCakes');
    const featuredCakes = cakesData.filter(cake => cake.featured);

    featuredContainer.innerHTML = featuredCakes.map(cake => createCakeCard(cake)).join('');
}

// Load All Cakes
function loadAllCakes() {
    const allCakesContainer = document.getElementById('allCakes');
    allCakesContainer.innerHTML = cakesData.map(cake => createCakeCard(cake)).join('');
}

// Create Cake Card HTML
function createCakeCard(cake) {
    return `
        <div class="cake-card" data-category="${cake.category}">
            <div class="cake-image">
                ${cake.emoji}
            </div>
            <div class="cake-info">
                <h3 class="cake-name">${cake.name}</h3>
                <p class="cake-price">₹${cake.price}</p>
                <p class="cake-description">${cake.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${cake.id})">
                    Add to Cart <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
}

// Filter Cakes
function filterCakes(category, event) {
    const cakeCards = document.querySelectorAll('#allCakes .cake-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // fallback for direct call
        filterBtns.forEach(btn => {
            if (btn.textContent.trim().toLowerCase() === category) btn.classList.add('active');
        });
    }
    // Show/hide cakes based on category
    cakeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'popout 0.4s cubic-bezier(.36,1.64,.7,.98)';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add to Cart
function addToCart(cakeId) {
    const cake = cakesData.find(c => c.id === cakeId);
    const existingItem = cart.find(item => item.id === cakeId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cake.id,
            name: cake.name,
            price: cake.price,
            emoji: cake.emoji,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showSuccessMessage(`${cake.name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Add animation
    cartCount.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        cartCount.style.animation = '';
    }, 500);
}

// Display Cart Items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious cakes to get started!</p>
                <button class="cta-button" onclick="showPage('cakes')">Shop Now</button>
            </div>
        `;
        cartTotal.innerHTML = '';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `
        <div class="cart-total">
            <div class="total-amount">Total: ₹${total}</div>
            <button class="checkout-btn" onclick="showPage('order')">
                Proceed to Checkout <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

// Update Quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartCount();
            displayCartItems();
            saveCart();
        }
    }
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    displayCartItems();
    saveCart();
}

// Save Cart to localStorage (Note: This is just for demo - in real Claude.ai environment, use variables)
function saveCart() {
    // In a real environment, you would save to localStorage
    // localStorage.setItem('cart', JSON.stringify(cart));
    // For this demo, we'll just keep it in memory
}

// Load Cart from localStorage
function loadCart() {
    // In a real environment, you would load from localStorage
    // const savedCart = localStorage.getItem('cart');
    // if (savedCart) {
    //     cart = JSON.parse(savedCart);
    // }
    // For this demo, cart starts empty
}

// Show Success Message
function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;

    // Add to body
    document.body.appendChild(successDiv);

    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Order Form Handling
async function submitOrder() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        deliveryDate: formData.get('deliveryDate'),
        deliveryTime: formData.get('deliveryTime'),
        specialInstructions: formData.get('specialInstructions'),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Use WhatsApp from config.json for order
    const config = await getConfig();
    const whatsapp = config && config.whatsapp ? config.whatsapp.replace(/\D/g, '') : '918509715190';
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderData);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart and show success
    cart = [];
    updateCartCount();
    showSuccessMessage('Order placed successfully! Redirecting to WhatsApp...');

    // Reset form
    form.reset();

    // Redirect to home page after 3 seconds
    setTimeout(() => {
        showPage('home');
    }, 3000);
}

// Create WhatsApp Message
function createWhatsAppMessage(orderData) {
    let message = `🎂 *New Cake Order* 🎂\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${orderData.name}\n`;
    message += `Phone: ${orderData.phone}\n`;
    message += `Email: ${orderData.email}\n\n`;

    message += `*Delivery Address:*\n`;
    message += `${orderData.address}\n`;
    message += `${orderData.city} - ${orderData.pincode}\n\n`;

    message += `*Delivery Details:*\n`;
    message += `Date: ${orderData.deliveryDate}\n`;
    message += `Time: ${orderData.deliveryTime}\n\n`;

    message += `*Order Items:*\n`;
    orderData.items.forEach(item => {
        message += `${item.emoji} ${item.name} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    message += `\n*Total Amount: ₹${orderData.total}*\n\n`;

    if (orderData.specialInstructions) {
        message += `*Special Instructions:*\n${orderData.specialInstructions}\n\n`;
    }

    message += `Please confirm this order. Thank you! 😊`;

    return message;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-menu-active');
    const btn = document.querySelector('.mobile-menu-btn i');
    if (navLinks.classList.contains('mobile-menu-active')) {
        navLinks.style.animation = 'slideDown 0.4s ease';
        btn.classList.remove('fa-bars');
        btn.classList.add('fa-times');
    } else {
        navLinks.style.animation = 'slideUp 0.3s ease';
        btn.classList.remove('fa-times');
        btn.classList.add('fa-bars');
    }
}

// Set minimum date for delivery (tomorrow)
function setMinDeliveryDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        deliveryDateInput.setAttribute('min', minDate);
        deliveryDateInput.value = minDate;
    }
}

// Initialize delivery date when order page loads
document.addEventListener('DOMContentLoaded', function () {
    // Set minimum delivery date when page loads
    setTimeout(setMinDeliveryDate, 100);
});

// Smooth scrolling for internal links
function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add some interactive animations
function addInteractiveAnimations() {
    // Add floating animation to cake cards
    const cakeCards = document.querySelectorAll('.cake-card');
    cakeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Call animations when cakes are loaded
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(addInteractiveAnimations, 500);
});

// Add to CSS for fade-in-up animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mobile-menu-active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        z-index: 1000;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Add popout animation to cake cards
const style = document.createElement('style');
style.textContent += `
@keyframes popout {
  0% { transform: scale(0.95); box-shadow: none; }
  60% { transform: scale(1.05); box-shadow: 0 8px 32px rgba(255,107,157,0.15); }
  100% { transform: scale(1); box-shadow: 0 8px 32px rgba(255,107,157,0.10); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
.cake-card:active, .cake-card:focus {
  animation: popout 0.4s cubic-bezier(.36,1.64,.7,.98);
}
`;
document.head.appendChild(style);

// Use WhatsApp from config.json for order
async function getConfig() {
    try {
        const res = await fetch('../bakery-management-system/config.json'); // fixed relative path
        return await res.json();
    } catch {
        return null;
    }
}