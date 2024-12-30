// index.html
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero__slide');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 5000); 
});

//shop.html
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sort");
    const itemsContainer = document.querySelector(".shop__items");
    const items = Array.from(itemsContainer.children);

    items.forEach((item, index) => {
        item.dataset.index = index;
    });

    sortSelect.addEventListener("change", (event) => {
        const value = event.target.value;

        if (value === "price-asc") {
            items.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(".shop__item-price").textContent.replace("$", ""));
                const priceB = parseFloat(b.querySelector(".shop__item-price").textContent.replace("$", ""));
                return priceA - priceB;
            });
        } else if (value === "price-desc") {
            items.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(".shop__item-price").textContent.replace("$", ""));
                const priceB = parseFloat(b.querySelector(".shop__item-price").textContent.replace("$", ""));
                return priceB - priceA;
            });
        } else if (value === "default") {
            items.sort((a, b) => a.dataset.index - b.dataset.index);
        }

        items.forEach(item => itemsContainer.appendChild(item));
    });
});

//product.html
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumbnail.src;

    document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
    thumbnail.classList.add('active');
}


document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const reviewTemplate = document.getElementById('reviewTemplate');
    const stars = document.querySelectorAll('.reviews__star');
    let selectedRating = 0;


    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            updateStarRating(selectedRating);
        });
    });

    const updateStarRating = (rating) => {
        stars.forEach(star => {
            star.classList.toggle('selected', parseInt(star.getAttribute('data-value')) <= rating);
        });
    };

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(reviewForm);
        const reviewText = formData.get('review');
        const authorName = formData.get('name');
        const currentDate = new Date().toLocaleDateString();

        if (!selectedRating) {
            alert('Please select a rating!');
            return;
        }

        const newReview = reviewTemplate.cloneNode(true);
        newReview.style.display = 'block';
        newReview.querySelector('.review__list-author').textContent = authorName;
        newReview.querySelector('.review__list-date').textContent = currentDate;
        newReview.querySelector('.review__list-text').textContent = reviewText;

        const ratingContainer = newReview.querySelector('.review__list-rating');
        for (let i = 0; i < selectedRating; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.color = '#f39c12';
            ratingContainer.appendChild(star);
        }

        reviewsList.appendChild(newReview);

        reviewForm.reset();
        updateStarRating(0);
        selectedRating = 0;
    });
});

//cart.html
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart__items');
    const subtotalElem = document.querySelector('.cart__summary-subtotal span');
    const totalElem = document.querySelector('.cart__summary-total span');
    const shippingCost = 5.00;

    function loadCart() {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        savedCart.forEach(item => {
            addItemToCart(item.title, item.info, item.price, item.image, item.quantity);
        });
        updateSummary();
    }

    function saveCart() {
        const cartItems = Array.from(document.querySelectorAll('.cart__item')).map(item => {
            return {
                title: item.querySelector('.cart__item-title').textContent,
                info: item.querySelector('.cart__item-info').textContent,
                price: item.querySelector('.cart__item-price').textContent,
                image: item.querySelector('.cart__item-image').src,
                quantity: parseInt(item.querySelector('.cart__item-count').textContent)
            };
        });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function updateSummary() {
        let subtotal = 0;
        document.querySelectorAll('.cart__item').forEach(item => {
            const price = parseFloat(item.querySelector('.cart__item-price').textContent.replace('$', '').replace(',', '.'));
            const quantity = parseInt(item.querySelector('.cart__item-count').textContent);
            subtotal += price * quantity;
        });
        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        totalElem.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
        saveCart();
    }

    function addItemToCart(title, info, price, image, quantity = 1) {
        const itemHTML = `
            <div class="cart__item">
                <img src="${image}" alt="${title}" class="cart__item-image">
                <div class="cart__item-details">
                    <h2 class="cart__item-title">${title}</h2>
                    <p class="cart__item-info">${info}</p>
                    <p class="cart__item-price">${price}</p>
                </div>
                <div class="cart__item-quantity">
                    <button class="cart__item-btn cart__item-btn--decrease">-</button>
                    <span class="cart__item-count">${quantity}</span>
                    <button class="cart__item-btn cart__item-btn--increase">+</button>
                </div>
                <button class="cart__item-remove">&times;</button>
            </div>`;
        cartContainer.insertAdjacentHTML('beforeend', itemHTML);
        updateEventListeners();
        updateSummary();
    }

    function updateEventListeners() {
        document.querySelectorAll('.cart__item-btn--decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const countElem = btn.nextElementSibling;
                let count = parseInt(countElem.textContent);
                if (count > 1) {
                    countElem.textContent = count - 1;
                    updateSummary();
                }
            });
        });

        document.querySelectorAll('.cart__item-btn--increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const countElem = btn.previousElementSibling;
                countElem.textContent = parseInt(countElem.textContent) + 1;
                updateSummary();
            });
        });

        document.querySelectorAll('.cart__item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.cart__item').remove();
                updateSummary();
            });
        });
    }

    loadCart();
});

// MyAccount.html
const signInBtn = document.querySelector('.sign_in__btn');
    const registerBtn = document.querySelector('.register__btn');
    const signInForm = document.getElementById('sign_in_form');
    const registerForm = document.getElementById('register_form');

    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signInBtn.classList.add('active');
        registerBtn.classList.remove('active');
        signInForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerBtn.classList.add('active');
        signInBtn.classList.remove('active');
        registerForm.classList.remove('hidden');
        signInForm.classList.add('hidden');
    });
