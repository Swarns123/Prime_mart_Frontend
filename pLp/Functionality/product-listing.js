const productGrid = document.querySelector("#productGrid");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.querySelector("#productSearch");
const sortSelect = document.querySelector("#sortProducts");
const productCount = document.querySelector("#productCount");
const emptyState = document.querySelector("#emptyState");
const cartCount = document.querySelector("#cartCount");
const themeToggle = document.querySelector(".theme-toggle");

let activeCategory = "all";
let cartItems = 0;
const productDetailsPage = "../../pdp/html/pdp.html";

function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem("primeMartTheme", theme);

    if (themeToggle) {
        themeToggle.textContent = "";
        themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    }
}

function getVisibleCards() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    return productCards.filter((card) => {
        const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
        const matchesSearch = card.dataset.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
}

function sortCards(cards) {
    const sortedCards = [...cards];

    if (sortSelect.value === "low-high") {
        sortedCards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    }

    if (sortSelect.value === "high-low") {
        sortedCards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    }

    if (sortSelect.value === "rating") {
        sortedCards.sort((a, b) => Number(b.dataset.rating) - Number(a.dataset.rating));
    }

    return sortedCards;
}

function updateProducts() {
    const visibleCards = sortCards(getVisibleCards());

    productCards.forEach((card) => {
        card.classList.add("hidden");
    });

    visibleCards.forEach((card) => {
        card.classList.remove("hidden");
        productGrid.appendChild(card);
    });

    productCount.textContent = `Showing ${visibleCards.length} product${visibleCards.length === 1 ? "" : "s"}`;
    emptyState.classList.toggle("show", visibleCards.length === 0);
}

function openProductDetails(card) {
    const productId = card.dataset.productId;

    if (!productId) {
        return;
    }

    window.location.href = `${productDetailsPage}?product=${encodeURIComponent(productId)}`;
}

productCards.forEach((card) => {
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View details for ${card.dataset.name}`);

    card.addEventListener("click", (event) => {
        if (event.target.closest("button")) {
            return;
        }

        openProductDetails(card);
    });

    card.addEventListener("keydown", (event) => {
        if (event.target.closest("button")) {
            return;
        }

        if (event.key === "Enter") {
            openProductDetails(card);
        }
    });
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.category;
        updateProducts();
    });
});

document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        cartItems += 1;
        cartCount.textContent = cartItems;
        button.textContent = "Added";
        button.classList.add("added");

        window.setTimeout(() => {
            button.textContent = "Add to Cart";
            button.classList.remove("added");
        }, 1200);
    });
});

searchInput.addEventListener("input", updateProducts);
sortSelect.addEventListener("change", updateProducts);

setTheme(localStorage.getItem("primeMartTheme") || document.body.dataset.theme || "light");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
    });
}

updateProducts();
