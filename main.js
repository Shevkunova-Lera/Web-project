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
document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelectorAll(".cart__item");

    cartItems.forEach((item) => {
        const decreaseBtn = item.querySelector(".cart__item-btn--decrease");
        const increaseBtn = item.querySelector(".cart__item-btn--increase");
        const removeBtn = item.querySelector(".cart__item-remove");
        const itemCount = item.querySelector(".cart__item-count");

        // Уменьшение количества
        decreaseBtn.addEventListener("click", () => {
            let count = parseInt(itemCount.textContent, 10);
            if (count > 1) {
                itemCount.textContent = count - 1;
            } else {
                alert("Количество товара не может быть меньше 1.");
            }
        });

        // Увеличение количества
        increaseBtn.addEventListener("click", () => {
            let count = parseInt(itemCount.textContent, 10);
            itemCount.textContent = count + 1;
        });

        // Удаление товара из корзины
        removeBtn.addEventListener("click", () => {
            item.remove();
            updateCartTotal();
        });
    });

    // Функция для обновления общей суммы корзины
    function updateCartTotal() {
        const cartItems = document.querySelectorAll(".cart__item");
        let total = 0;

        cartItems.forEach((item) => {
            const priceElement = item.querySelector(".cart__item-price");
            const itemCount = item.querySelector(".cart__item-count");
            const price = parseFloat(priceElement.textContent.replace("$", ""));
            const count = parseInt(itemCount.textContent, 10);

            total += price * count;
        });

        // Обновление отображения общей суммы
        const totalElement = document.querySelector(".cart__total");
        if (totalElement) {
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    // Инициализация обновления общей суммы
    updateCartTotal();
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
