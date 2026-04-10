import { initCart } from "./cart.js";
import { initProducts } from "./productos.js"

export const serverURL = "http://localhost:3002"

export function setBodyScroll(visible) {
    try {
        if (visible) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    } catch (e) {
        console.error('Error setting body scroll:', e);
    }
}

export function createPopupElements() {
    try {
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
    } catch (e) {
        console.error('Error creating popup elements:', e);
        return { popup: null, overlay: null };
    }
}

export function setupGlobalListeners(popup, overlay) {
    try {
        popup.addEventListener("click", e => e.stopPropagation());
        overlay.addEventListener("click", (e) => {
            const checkoutModal = document.getElementById('checkoutModal');
            checkoutModal.classList.remove('visible');
            popup.classList.remove('visible');
            overlay.classList.remove('visible');
            setBodyScroll(false);
        });
    } catch (e) {
        console.error('Error setting up global listeners:', e);
    }
}

function init() {
    try {
        const { popup, overlay } = createPopupElements();
        setupGlobalListeners(popup, overlay);
        initProducts();
        initCart(popup, overlay);
    } catch (e) {
        console.error('Error during initialization:', e);
    }
}

window.addEventListener("DOMContentLoaded", init);