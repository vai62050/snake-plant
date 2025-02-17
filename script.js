// Cart State
let cartItems = [];
let cartOpen = false;

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const quantity = document.getElementById('quantity');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const addToCartBtn = document.getElementById('addToCart');
const variationBtns = document.querySelectorAll('.variation-btn');
const mainImage = document.getElementById('mainImage');

// Sample product data
const currentProduct = {
    id: 1,
    name: 'Snake Plant',
    price: 550,
    image: './snakeplant1.jpg'
};

// Suggested products data
const suggestedProducts = [
    {
        id: 2,
        name: 'Peace Lilly ',
        price: 1300,
        rating: 0,
        image: './peacelilly1.jpg',
        link:'https://vai62050.github.io/peace-lilly',
    },
    {
        id: 3,
        name: 'Monstera Deliciosa ',
        price: 2500,
        rating: 0,
        image: './monstera1.jpg',
        link:'https://vai62050.github.io/monstera-delicosa',
    },
    {
        id: 4,
        name: 'Ceramic Plant Pot',
        price: 250,
        rating: 0,
        image: './ceramic-pot.jpg',
        link:'https://vai62050.github.io/ceramic-pot',
    }
];

// Initialize suggested products
function initializeSuggestedProducts() {
    const container = document.querySelector('.suggestions-container');
    container.innerHTML = ''; // Clear existing content
    suggestedProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
            <a href="${product.link}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--border-radius);">
                <h3>${product.name}</h3>
                <div class="rating">
                    <div class="stars">
                        ${getStarRating(product.rating)}
                    </div>
                    <span>${product.rating}</span>
                </div>
                <div class="price">₹${product.price}</div>
            </a>
            <button class="add-to-cart-btn" onclick="addSuggestedToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Function to add suggested product to cart
function addSuggestedToCart(productId) {
    const product = suggestedProducts.find(p => p.id === productId);
    if (product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        updateCartDisplay();
        
        // Show feedback
        const btn = event.target;
        btn.textContent = 'Added!';
        btn.style.backgroundColor = '#45a049';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.backgroundColor = '';
        }, 1000);
    }
}

// Generate star rating HTML
function getStarRating(rating) {
    let stars = '';
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
        if (roundedRating >= i) {
            stars += '<i class="fas fa-star"></i>'; // Full star
        } else if (roundedRating === i - 0.5) {
            stars += '<i class="fas fa-star-half-alt"></i>'; // Half star
        } else {
            stars += '<i class="far fa-star"></i>'; // Empty star
        }
    }
    return stars;
}

// Update product rating display
function updateProductRating() {
    const ratingValue = parseFloat(document.querySelector('.rating-value').textContent);
    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = getStarRating(ratingValue);
}

// Cart Functions
function toggleCart() {
    cartOpen = !cartOpen;
    cartOverlay.classList.toggle('active');
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.style.cssText = 'display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--light-gray);';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--border-radius);">
            <div style="flex-grow: 1;">
                <h3 style="margin: 0;">${item.name}</h3>
                <p style="margin: 0;">₹${item.price}</p>
            </div>
            <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="qty-btn">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn">+</button>
            </div>
        `;

        // Add event listeners for quantity buttons
        const [decreaseBtn, increaseBtn] = itemElement.querySelectorAll('.qty-btn');
        decreaseBtn.addEventListener('click', () => updateCartItemQuantity(item.id, item.quantity - 1));
        increaseBtn.addEventListener('click', () => updateCartItemQuantity(item.id, item.quantity + 1));

        cartItemsContainer.appendChild(itemElement);
    });
    
    updateCartCount();
    updateCartTotal();
}

function updateCartItemQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        cartItems = cartItems.filter(item => item.id !== id);
    } else {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCartDisplay();
}

function addToCart() {
    const qty = parseInt(quantity.value);
    const existingItem = cartItems.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cartItems.push({
            ...currentProduct,
            quantity: qty
        });
    }
    
    updateCartDisplay();
    // Show feedback animation
    addToCartBtn.classList.add('added');
    setTimeout(() => addToCartBtn.classList.remove('added'), 1000);
}

// Quantity Controls
function updateQuantity(delta) {
    const newValue = parseInt(quantity.value) + delta;
    if (newValue >= 1) {
        quantity.value = newValue;
    }
}

// Product Image Variation
function updateMainImage(btn) {
    if (!btn || !btn.dataset || !btn.dataset.img) return;
    
    const newImage = btn.dataset.img;
    mainImage.src = newImage;
    currentProduct.image = newImage; // Update current product image
    
    // Update active state
    variationBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Add fade animation
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 50);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeSuggestedProducts();
    updateProductRating(); // Update initial product rating display
    
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    decreaseQty.addEventListener('click', () => updateQuantity(-1));
    increaseQty.addEventListener('click', () => updateQuantity(1));
    
    addToCartBtn.addEventListener('click', addToCart);
    
    // Update variation button event listeners
    variationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event bubbling
            updateMainImage(btn);
        });
    });
    
    // Close cart when clicking outside
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            toggleCart();
        }
    });
    
    // Initialize cart display
    updateCartDisplay();
});

// DOM Elements
const reviewForm = document.getElementById('reviewForm');
const ratingInput = document.getElementById('ratingInput');
const reviewText = document.getElementById('reviewText');
const reviewImages = document.getElementById('reviewImages');
const imagePreview = document.getElementById('imagePreview');
const reviewsList = document.getElementById('reviewsList');
const averageRating = document.getElementById('averageRating');
const averageStars = document.getElementById('averageStars');
const totalReviews = document.getElementById('totalReviews');
const sortReviews = document.getElementById('sortReviews');
const reviewTemplate = document.getElementById('reviewTemplate');

// State Management
let selectedRating = 0;
let reviews = [];

// Initialize the review system
function initReviewSystem() {
    // Set up event listeners
    ratingInput.addEventListener('click', handleRatingClick);
    reviewForm.addEventListener('submit', handleReviewSubmit);
    reviewImages.addEventListener('change', handleImageUpload);
    sortReviews.addEventListener('change', handleSortChange);

    // Initialize hover effects for rating stars
    initRatingHover();
}

// Handle star rating selection
function handleRatingClick(e) {
    const star = e.target;
    if (star.tagName === 'I') {
        selectedRating = parseInt(star.dataset.rating);
        updateRatingDisplay();
    }
}

// Initialize rating hover effects
function initRatingHover() {
    const stars = ratingInput.children;
    
    // Hover effects
    [...stars].forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });
    });

    // Reset on mouse leave
    ratingInput.addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
}

// Highlight stars up to the selected rating
function highlightStars(rating) {
    const stars = ratingInput.children;
    [...stars].forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.className = starRating <= rating ? 'fas fa-star' : 'far fa-star';
    });
}

// Update the rating display
function updateRatingDisplay() {
    highlightStars(selectedRating);
}

// Handle image upload
function handleImageUpload(e) {
    const files = e.target.files;
    imagePreview.innerHTML = '';

    [...files].forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = createImagePreview(e.target.result);
                imagePreview.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Create image preview element
function createImagePreview(src) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    
    const img = document.createElement('img');
    img.src = src;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = function() {
        div.remove();
    };
    
    div.appendChild(img);
    div.appendChild(removeBtn);
    return div;
}

// Handle review submission
async function handleReviewSubmit(e) {
    e.preventDefault();

    // Validation
    if (!selectedRating) {
        showError('Please select a rating');
        return;
    }

    if (!reviewText.value.trim()) {
        showError('Please write a review');
        return;
    }

    // Gather images
    const images = [...imagePreview.children].map(
        preview => preview.querySelector('img').src
    );

    // Create review object
    const review = {
        id: Date.now(),
        rating: selectedRating,
        text: reviewText.value.trim(),
        images: images,
        date: new Date(),
    };

    // Add review to state
    reviews.unshift(review);

    // Update UI
    addReviewToList(review);
    updateAverageRating();
    resetForm();

    // Show success message
    showSuccess('Review submitted successfully!');
}

// Add a review to the display list
function addReviewToList(review) {
    const reviewElement = reviewTemplate.content.cloneNode(true);
    
    // Set rating stars
    const starsContainer = reviewElement.querySelector('.stars');
    starsContainer.innerHTML = createStarRating(review.rating);

    // Set date
    const dateElement = reviewElement.querySelector('.review-date');
    dateElement.textContent = formatDate(review.date);

    // Set review text
    const textElement = reviewElement.querySelector('.review-text');
    textElement.textContent = review.text;

    // Add images if any
    if (review.images.length > 0) {
        const imagesContainer = reviewElement.querySelector('.review-images');
        review.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'review-image';
            img.onclick = () => openImageModal(src);
            imagesContainer.appendChild(img);
        });
    }

    // Add to DOM with animation
    const reviewItem = reviewElement.querySelector('.review-item');
    reviewItem.style.opacity = '0';
    reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
    
    // Trigger animation
    setTimeout(() => {
        reviewItem.style.opacity = '1';
    }, 10);
}

// Create star rating HTML
function createStarRating(rating) {
    return Array(5).fill(0).map((_, index) => {
        const starClass = index < rating ? 'fas' : 'far';
        return `<i class="${starClass} fa-star"></i>`;
    }).join('');
}

// Update average rating display
function updateAverageRating() {
    if (reviews.length === 0) {
        averageRating.textContent = '0.0';
        totalReviews.textContent = '0';
        return;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    
    averageRating.textContent = average.toFixed(1);
    totalReviews.textContent = reviews.length;

    // Update average stars display
    const stars = averageStars.children;
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;

    [...stars].forEach((star, index) => {
        if (index < fullStars) {
            star.className = 'fas fa-star';
        } else if (index === fullStars && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
    });
    UpdateTheReview();
}

// Handle sort change
function handleSortChange(e) {
    const sortType = e.target.value;
    
    reviews.sort((a, b) => {
        switch (sortType) {
            case 'newest':
                return b.date - a.date;
            case 'highest':
                return a.rating - b.rating;
            case 'lowest':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    // Rerender reviews
    reviewsList.innerHTML = '';
    reviews.forEach(review => addReviewToList(review));
}

// Reset form after submission
function resetForm() {
    reviewForm.reset();
    selectedRating = 0;
    updateRatingDisplay();
    imagePreview.innerHTML = '';
}

// Format date for display
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    reviewForm.insertBefore(errorDiv, reviewForm.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    successDiv.style.color = 'var(--success)';
    
    reviewForm.insertBefore(successDiv, reviewForm.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize the review system when the DOM is loaded
document.addEventListener('DOMContentLoaded', initReviewSystem);

function UpdateTheReview(){
        const star_Rating = document.querySelector(".rating-value");
        const average_star_rating=averageRating.innerHTML;
        star_Rating.innerHTML =average_star_rating;
        updateProductRating();

}
