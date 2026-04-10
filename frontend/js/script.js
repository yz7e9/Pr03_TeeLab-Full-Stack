import { initCart } from "./cart.js";
import { initProducts } from "./productos.js"

export const serverURL = "http://localhost:3002"

export function setBodyScroll(visible) {
    if (visible) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
}

export function createPopupElements() {
    const cartEl = document.querySelector(".cart");
    const popup = document.createElement("div");
    popup.id = "cartPopup";
    popup.className = "cart-popup";
    cartEl.appendChild(popup);
    const overlay = document.createElement("div");
    overlay.id = "globalOverlay";
    overlay.className = "global-overlay";
    document.body.appendChild(overlay);
    const checkoutModal = document.createElement("div");
    checkoutModal.id = "checkoutModal";
    checkoutModal.className = "checkout-modal";
    document.body.appendChild(checkoutModal);
    return { popup, overlay };
}

export function setupGlobalListeners(popup, overlay) {
    popup.addEventListener("click", e => e.stopPropagation());
    overlay.addEventListener("click", (e) => {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.classList.remove('visible');
        if (popup) popup.classList.remove('visible');
        overlay.classList.remove('visible');
        setBodyScroll(false);
    });
}

function init() {
    const { popup, overlay } = createPopupElements();
    setupGlobalListeners(popup, overlay);
    initProducts();
    initCart(popup, overlay);
}

window.addEventListener("DOMContentLoaded", init);