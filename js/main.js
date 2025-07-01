// Configuration from config.json
const businessConfig = {
    businessName: "Sweet Delights Bakery",
    owner: "Test Person",
    address: "123 Sweet Street, Cake Town, CT 123456",
    phone: ["+91 77198", "+91 87654 32109"],
    email: ["orders@sweetdelights.com", "info@sweetdelights.com"],
    whatsapp: "+91 8509715190",
    website: "https://sweetdelights.com",
    settings: {
        currency: "INR",
        delivery: {
            sameDay: true,
            freeAbove: 500
        },
        workingHours: {
            "mon-sat": "9:00 AM - 9:00 PM",
            "sun": "10:00 AM - 6:00 PM"
        }
    }
};

// Initial Cake Data (will be synced with management system)
let cakesData = [
    {
        id: 1,
        name: "Chocolate Truffle",
        price: 500,
        category: "chocolate",
        emoji: "🍫",
        description: "Rich chocolate cake with truffle frosting",
        featured: true,
        stock: 10
    },
    {
        id: 2,
        name: "Classic Vanilla",
        price: 400,
        category: "vanilla",
        emoji: "🍰",
        description: "Classic vanilla cake with creamy buttercream",
        featured: true,
        stock: 8
    },
    {
        id: 3,
        name: "Fresh Fruit Cake",
        price: 600,
        category: "fruit",
        emoji: "🍓",
        description: "Fresh seasonal fruits with whipped cream",
        featured: true,
        stock: 5
    },
    {
        id: 4,
        name: "Red Velvet",
        price: 650,
        category: "special",
        emoji: "❤️",
        description: "Moist red velvet with cream cheese frosting",
        featured: false,
        stock: 7
    },
    {
        id: 5,
        name: "Black Forest Cake",
        price: 749,
        category: "chocolate",
        emoji: "🍒",
        description: "Chocolate cake with cherries and whipped cream",
        featured: false,
        stock: 6
    },
    {
        id: 6,
        name: "Lemon Drizzle Cake",
        price: 549,
        category: "fruit",
        emoji: "🍋",
        description: "Tangy lemon cake with sweet glaze",
        featured: false,
        stock: 4
    },
    {
        id: 7,
        name: "Carrot Cake",
        price: 599,
        category: "special",
        emoji: "🥕",
        description: "Spiced carrot cake with cream cheese frosting",
        featured: false,
        stock: 3
    },
    {
        id: 8,
        name: "Tiramisu Cake",
        price: 799,
        category: "special",
        emoji: "☕",
        description: "Coffee-flavored Italian dessert cake",
        featured: false,
        stock: 5
    }
];

// Cart array to store cart items
let cart = [];
let isMobileMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedCakes();
    loadAllCakes();
    updateCartCount();
    loadCart();
    setMinDeliveryDate();
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add intersection observer for animations
    setupIntersectionObserver();
});

// Setup Intersection Observer for animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cake cards
    setTimeout(() => {
        document.querySelectorAll('.cake-card').forEach(card => {
            observer.observe(card);
        });
    }, 100);
}

// Page Navigation with smooth transitions
function showPage(pageId) {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Hide all pages with fade out
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page with fade in
    setTimeout(() => {
        document.getElementById(pageId).classList.add('active');
        
        // Load specific page content
        if (pageId === 'cart') {
            displayCartItems();
        } else if (pageId === 'management') {
            loadManagementSystem();
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
}

// Enhanced Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        navLinks.classList.add('mobile-menu-active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        navLinks.classList.remove('mobile-menu-active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (isMobileMenuOpen && !nav.contains(event.target)) {
        toggleMobileMenu();
    }
});

// Load Featured Cakes
function loadFeaturedCakes() {
    const featuredContainer = document.getElementById('featuredCakes');
    const featuredCakes = cakesData.filter(cake => cake.featured);
    
    featuredContainer.innerHTML = featuredCakes.map((cake, index) => 
        createCakeCard(cake, index * 100)
    ).join('');
}

// Load All Cakes
function loadAllCakes() {
    const allCakesContainer = document.getElementById('allCakes');
    allCakesContainer.innerHTML = cakesData.map((cake, index) => 
        createCakeCard(cake, index * 50)
    ).join('');
}

// Create Cake Card HTML with animation delay
function createCakeCard(cake, animationDelay = 0) {
    return `
        <div class="cake-card" data-category="${cake.category}" style="animation-delay: ${animationDelay}ms">
            <div class="cake-image">
                ${cake.emoji}
            </div>
            <div class="cake-info">
                <h3 class="cake-name">${cake.name}</h3>
                <p class="cake-price">₹${cake.price}</p>
                <p class="cake-description">${cake.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="color: #666; font-size: 0.9rem;">Stock: ${cake.stock}</span>
                    ${cake.featured ? '<span style="background: #ff6b9d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">Featured</span>' : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${cake.id})" ${cake.stock === 0 ? 'disabled style="background: #ccc; cursor: not-allowed;"' : ''}>
                    ${cake.stock === 0 ? 'Out of Stock' : 'Add to Cart'} <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
}

// Enhanced Filter Cakes with smooth animations
function filterCakes(category) {
    const cakeCards = document.querySelectorAll('#allCakes .cake-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Animate cards out first
    cakeCards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        }, index * 50);
    });
}

// Enhanced Add to Cart with better feedback
function addToCart(cakeId) {
    const cake = cakesData.find(c => c.id === cakeId);
    
    if (!cake || cake.stock === 0) {
        showSuccessMessage('Sorry, this cake is out of stock!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === cakeId);
    
    if (existingItem) {
        if (existingItem.quantity >= cake.stock) {
            showSuccessMessage('Cannot add more items than available stock!', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cake.id,
            name: cake.name,
            price: cake.price,
            emoji: cake.emoji,
            quantity: 1,
            maxStock: cake.stock
        });
    }
    
    updateCartCount();
    saveCart();
    showSuccessMessage(`${cake.name} added to cart!`, 'success');
    
    // Add visual feedback to button
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1000);
}

// Enhanced Update Cart Count with animation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Animate count change
    cartCount.style.transform = 'scale(1.3)';
    cartCount.textContent = totalItems;
    
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

// Enhanced Display Cart Items
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
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="animation-delay: ${index * 100}ms">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
                <div style="color: #666; font-size: 0.9rem;">Max available: ${item.maxStock}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${item.quantity >= item.maxStock ? 'disabled style="background: #ccc;"' : ''}>+</button>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: bold; color: var(--primary-color);">₹${item.price * item.quantity}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = total >= businessConfig.settings.delivery.freeAbove ? 0 : 50;
    const finalTotal = total + deliveryFee;
    
    cartTotal.innerHTML = `
        <div class="cart-total">
            <div style="margin-bottom: 0.5rem;">Subtotal: ₹${total}</div>
            <div style="margin-bottom: 0.5rem;">Delivery: ${deliveryFee === 0 ? 'Free' : '₹' + deliveryFee}</div>
            ${total >= businessConfig.settings.delivery.freeAbove ? '<div style="color: green; font-size: 0.9rem; margin-bottom: 0.5rem;">🎉 Free delivery applied!</div>' : ''}
            <div class="total-amount">Total: ₹${finalTotal}</div>
            <button class="checkout-btn" onclick="showPage('order')">
                Proceed to Checkout <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

// Enhanced Update Quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else if (newQuantity <= item.maxStock) {
            item.quantity = newQuantity;
            updateCartCount();
            displayCartItems();
            saveCart();
        } else {
            showSuccessMessage('Cannot exceed available stock!', 'warning');
        }
    }
}

// Enhanced Remove from Cart
function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartCount();
    displayCartItems();
    saveCart();
    
    if (item) {
        showSuccessMessage(`${item.name} removed from cart`, 'info');
    }
}

// Save Cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('sweetDelightsCart', JSON.stringify(cart));
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// Load Cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('sweetDelightsCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            // Validate cart items against current stock
            cart = cart.filter(item => {
                const cakeData = cakesData.find(cake => cake.id === item.id);
                if (cakeData) {
                    item.maxStock = cakeData.stock;
                    if (item.quantity > cakeData.stock) {
                        item.quantity = cakeData.stock;
                    }
                    return cakeData.stock > 0;
                }
                return false;
            });
            updateCartCount();
        }
    } catch (e) {
        console.log('Error loading cart from localStorage');
    }
}

// Enhanced Show Success Message
function showSuccessMessage(message, type = 'success') {
    const successDiv = document.createElement('div');
    successDiv.className = `success-message show ${type}`;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    
    // Set colors based on type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    successDiv.style.background = colors[type] || colors.success;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Enhanced Order Form Handling
function submitOrder() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty!', 'warning');
        return;
    }
    
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
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    const deliveryFee = orderData.subtotal >= businessConfig.settings.delivery.freeAbove ? 0 : 50;
    orderData.total = orderData.subtotal + deliveryFee;
    orderData.deliveryFee = deliveryFee;
    
    const whatsappMessage = createWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Clear cart and show success
        cart = [];
        updateCartCount();
        saveCart();
        showSuccessMessage('Order placed successfully! Redirecting to WhatsApp...', 'success');
        
        // Reset form
        form.reset();
        setMinDeliveryDate();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to home page
        setTimeout(() => showPage('home'), 3000);
    }, 1500);
}

// Enhanced WhatsApp Message Creation
function createWhatsAppMessage(orderData) {
    let message = `🎂 *${businessConfig.businessName}* 🎂\n`;
    message += `*New Order Request*\n\n`;
    
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${orderData.name}\n`;
    message += `📱 Phone: ${orderData.phone}\n`;
    if (orderData.email) message += `📧 Email: ${orderData.email}\n`;
    message += `\n`;
    
    message += `*Delivery Address:*\n`;
    message += `📍 ${orderData.address}\n`;
    message += `🏙️ ${orderData.city} - ${orderData.pincode}\n\n`;
    
    message += `*Delivery Details:*\n`;
    message += `📅 Date: ${orderData.deliveryDate}\n`;
    message += `⏰ Time: ${orderData.deliveryTime}\n\n`;
    
    message += `*Order Items:*\n`;
    orderData.items.forEach(item => {
        message += `${item.emoji} ${item.name}\n`;
        message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*Order Summary:*\n`;
    message += `💰 Subtotal: ₹${orderData.subtotal}\n`;
    message += `🚚 Delivery: ${orderData.deliveryFee === 0 ? 'Free' : '₹' + orderData.deliveryFee}\n`;
    message += `💳 *Total Amount: ₹${orderData.total}*\n\n`;
    
    if (orderData.specialInstructions) {
        message += `*Special Instructions:*\n`;
        message += `📝 ${orderData.specialInstructions}\n\n`;
    }
    
    message += `Please confirm this order. Thank you! 😊\n\n`;
    message += `---\n`;
    message += `${businessConfig.businessName}\n`;
    message += `${businessConfig.address}`;
    
    return message;
}

// Set minimum date for delivery
function setMinDeliveryDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        deliveryDateInput.setAttribute('min', minDate);
        if (!deliveryDateInput.value) {
            deliveryDateInput.value = minDate;
        }
    }
}

// Contact form handling
function sendContactMessage() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    const whatsappMessage = `*Contact Message*\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n\n` +
        `Message: ${message}`;
    
    const whatsappUrl = `https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    showSuccessMessage('Message sent successfully!', 'success');
    
    // Reset form
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

// Function to sync cakes data with management system
function syncCakesData(newCakesData) {
    cakesData = newCakesData;
    loadFeaturedCakes();
    loadAllCakes();
    
    // Update cart items with new stock info
    cart = cart.filter(item => {
        const cakeData = cakesData.find(cake => cake.id === item.id);
        if (cakeData && cakeData.stock > 0) {
            item.maxStock = cakeData.stock;
            if (item.quantity > cakeData.stock) {
                item.quantity = cakeData.stock;
            }
            return true;
        }
        return false;
    });
    
    updateCartCount();
    saveCart();
    
    // Re-setup intersection observer
    setTimeout(setupIntersectionObserver, 100);
}

// Load Management System
function loadManagementSystem() {
    const managementContainer = document.getElementById('cakeManagementSystem');
    if (managementContainer && typeof renderManagementSystem === 'function') {
        renderManagementSystem(managementContainer, cakesData, syncCakesData);
    }
}

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Smooth scroll behavior for all internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading states to all buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button:not(.quantity-btn):not(.remove-btn):not(.mobile-menu-btn)')) {
        const button = e.target;
        if (!button.disabled && !button.classList.contains('loading')) {
            button.classList.add('loading');
            setTimeout(() => button.classList.remove('loading'), 1000);
        }
    }
});