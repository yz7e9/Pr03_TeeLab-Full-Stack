import { showCheckoutModal } from "./checkout.js";
import { setBodyScroll } from "./script.js";
let cart = loadCart();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];
    return raw.map(item => {
        if (item.cantidad === undefined) item.cantidad = 0;
        if (item.precio === undefined) item.precio = 0;
        return item;
    });
}

function getCamisetaId(article) {
    return article.id || article.nombre.toLowerCase();
}

function findCartItem(camisetaId, size, color) {
    return cart.find(item => item.camisetaId === camisetaId && item.talla === size && item.color === color);
}

function createCartItem(article, size, color, quantity) {
    return {
        camisetaId: getCamisetaId(article),
        nombre: article.nombre,
        talla: size,
        color: color,
        cantidad: quantity,
        precio: article.precioBase,
        image: article.imagenes[color]
    };
}

function addToCart(article, size, color, quantity) {
    const camisetaId = getCamisetaId(article);
    const existing = findCartItem(camisetaId, size, color);
    if (existing) {
        existing.cantidad += quantity;
    } else {
        cart.push(createCartItem(article, size, color, quantity));
    }
}

function handleCartButtonClick(article) {
    try {
        const nameId = article.nombre.toLowerCase();
        const sizeEl = document.getElementById(nameId + "-tallas-select");
        const colorEl = document.getElementById(nameId + "-colores-select");
        const quantityEl = document.getElementById(nameId + "-quantity");
        const size = sizeEl.value;
        const color = colorEl.value;
        const quantity = parseInt(quantityEl.value);
        if (quantity <= 0) return;
        addToCart(article, size, color, quantity);
        quantityEl.value = 0;
        saveCart();
        updateCartBadge();
        renderCart();
    } catch (e) {
        console.error('Error handling cart button click:', e);
    }
}

export function createBtnCart(article) {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Añadir al carrito";
    btn.className = "btn-cesta";
    btn.addEventListener("click", () => handleCartButtonClick(article));
    return btn;
}

function updateCartBadge() {
    const badge = document.getElementById("cartCount");
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "block" : "none";
}

function getCartTotals(cart) {
    return cart.reduce((acc, i) => {
        acc.items += i.cantidad;
        acc.price += i.precio * i.cantidad;
        return acc;
    }, { items: 0, price: 0 });
}

function renderCartItem(item, i) {
    return `<div class="cart-item">
        <img src="${item.image}" alt="${item.nombre}">
        <div class="cart-item-info">
            <strong>${item.nombre}</strong>
            <span>${item.talla} / ${item.color}</span>
            <span>${item.cantidad} x ${(item.precio ?? 0).toFixed(2)}€</span>
        </div>
        <div class="cart-item-actions">
            <button class="cart-item-minus" data-index="${i}">&minus;</button>
            <button class="cart-item-remove" data-index="${i}">&times;</button>
        </div>
    </div>`;
}

function renderCartItems(cart) {
    return cart.map(renderCartItem).join('');
}

function renderCartFooter(totalItems, totalPrice) {
    return `<div class="cart-total">
        <span>${totalItems} artículo${totalItems > 1 ? "s" : ""}</span>
        <strong>${totalPrice.toFixed(2)}€</strong>
    </div>
    <div class="cart-actions">
        <button class="cart-clear-all">Vaciar carrito</button>
        <button class="cart-checkout">Checkout</button>
    </div>`;
}

function buildCartHTML() {
    const { items, price } = getCartTotals(cart);
    return `${renderCartItems(cart)}${renderCartFooter(items, price)}`;
}

function attachMinusHandlers(popup) {
    popup.querySelectorAll(".cart-item-minus").forEach(btn => {
        btn.addEventListener("click", e => {
            try {
                const i = parseInt(e.target.dataset.index);
                cart[i].cantidad--;
                if (cart[i].cantidad <= 0) {
                    cart.splice(i, 1);
                }
                saveCart();
                updateCartBadge();
                renderCart();
            } catch (error) {
                console.error("Error handling minus button:", error.message);
            }
        });
    });
}

function attachRemoveHandlers(popup) {
    popup.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", e => {
            try {
                const idx = parseInt(e.target.dataset.index);
                if (!isNaN(idx)) {
                    cart.splice(idx, 1);
                    saveCart();
                    updateCartBadge();
                    renderCart();
                }
            } catch (err) {
                console.error('Error in remove handler:', err);
            }
        });
    });
}

function attachClearHandler(popup) {
    try {
        const clearBtn = popup.querySelector('.cart-clear-all');
        clearBtn.addEventListener('click', () => {
            cart = [];
            saveCart();
            updateCartBadge();
            renderCart();
        });
    } catch (e) {
        console.error('Error in clear handler:', e);
    }
}

function attachCheckoutHandler(popup) {
    try {
        const checkoutBtn = popup.querySelector('.cart-checkout');
        checkoutBtn.addEventListener('click', () => {
            popup.classList.remove('visible');
            showCheckoutModal(cart, saveCart, updateCartBadge, renderCart);
        });
    } catch (e) {
        console.error('Error in checkout handler:', e);
    }
}

function renderCart() {
    try {
        const popup = document.getElementById("cartPopup");
        if (cart.length === 0) {
            popup.innerHTML = `<p class="cart-empty">El carrito está vacío</p>`;
            return;
        }
        popup.innerHTML = buildCartHTML();
        attachMinusHandlers(popup);
        attachRemoveHandlers(popup);
        attachClearHandler(popup);
        attachCheckoutHandler(popup);
    } catch (e) {
        console.error('Error rendering cart:', e);
    }
}

function setupCartToggle(popup, overlay) {
    try {
        const cartEl = document.querySelector(".cart");
        cartEl.addEventListener("click", e => {
            try {
                if (e.target.closest(".cart-popup")) return;
                const visible = popup.classList.toggle("visible");
                overlay.classList.toggle("visible", visible);
                setBodyScroll(visible);
            } catch (error) {
                console.error("Error handling cart toggle click:", error.message);
            }
        });
    } catch (error) {
        console.error("Error setting up cart toggle:", error.message);
    }
}

export function initCart(popup, overlay) {
    setupCartToggle(popup, overlay);
    updateCartBadge();
    renderCart();
}
