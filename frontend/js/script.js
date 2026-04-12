import { initCart } from "./cart.js";
import { initProducts } from "./productos.js"

export const serverURL = "http://localhost:3002"

export const createEl = (tag, props = {}) => Object.assign(document.createElement(tag), props);

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
        const popup = createEl("div", { id: "cartPopup", className: "cart-popup" });
        const overlay = createEl("div", { id: "globalOverlay", className: "global-overlay" });
        const checkoutModal = createEl("div", { id: "checkoutModal", className: "checkout-modal" });
        cartEl.appendChild(popup);
        document.body.append(overlay, checkoutModal);
        return { popup, overlay };
    } catch (e) {
        console.error("Error creating popup elements:", e);
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