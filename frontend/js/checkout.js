import { serverURL } from "./script.js";

function renderModalContent(cart) {
    return `
        ${getHeader('Revisar pedido')}
        <div class="checkout-summary">
            ${cart.map(item => `<p>${item.cantidad} x ${item.nombre} (${item.talla}/${item.color}) - ${item.precio.toFixed(2)}€</p>`).join('')}
            <p><strong>${cart.reduce((sum, item) => sum + item.cantidad, 0)} artículos - Total: ${cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toFixed(2)}€</strong></p>
        </div><hr>
        <form id="checkoutForm">
            <input type="text" id="checkoutName" placeholder="Nombre" required />
            <input type="email" id="checkoutEmail" placeholder="Email" required />
            <textarea id="checkoutAddress" placeholder="Dirección de envío" required></textarea>
            <button type="submit">Confirmar compra</button>
        </form>
    `;
}

function storeOrderId(id) {
    if (!id) return;
    localStorage.setItem('orderId', id);
}

function formatItem(it) {
    return `
        <div class="order-item">
            <div class="item-header"><strong>${it.cantidad} × ${it.nombre || ''}</strong></div>
            <div class="item-body">
                <p class="details">Talla: <em>${it.talla || ''}</em> / Color: <em>${it.color || ''}</em></p>
                <p class="price">Precio unitario: <span>${(it.precioUnitario ?? 0).toFixed(2)}€</span> – Subtotal: <span>${(it.subtotal ?? 0).toFixed(2)}€</span></p>
            </div>
        </div>`;
}

function formatOrderDetails(order) {
    const dateStr = new Date(order.fecha).toLocaleString();
    const itemsHtml = (order.items || []).map(it => formatItem(it)).join('');
    return `
        ${getHeader('¡Gracias por su pedido!')}
        <section class="order-summary">
            <p><strong>ID:</strong> ${order.id}</p>
            <p><strong>Fecha:</strong> ${dateStr}</p>
            <p><strong>Estado:</strong> ${order.estado}</p>
            <p><strong>Productos:</strong></p>
            <div class="order-items">${itemsHtml}</div>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
        </section>`;
}

function renderOrderDone(data) {
    if (!data || !data.comandas) return '';
    return formatOrderDetails(data.comandas);
}

function getCheckoutPayload(cart) {
    const cliente = {
        nombre: document.getElementById('checkoutName').value.trim(),
        email: document.getElementById('checkoutEmail').value.trim()
    };
    const direccion = document.getElementById('checkoutAddress').value.trim();
    const items = cart.map(item => ({
        camisetaId: item.camisetaId,
        talla: item.talla,
        color: item.color,
        cantidad: item.cantidad
    }));
    return { cliente, direccion, items };
}

async function postOrder(payload) {
    const response = await fetch(`${serverURL}/api/comandas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error('Error al crear la comanda: ' + (err.message || response.statusText));
    }
    return response.json();
}

async function getOrderDetails(orderId) {
    const resp = await fetch(`${serverURL}/api/comandas/${orderId}`);
    if (!resp.ok) {
        const err = await resp.json();
        throw new Error('Error fetching order details: ' + (err.message || resp.statusText));
    }
    const fetched = await resp.json();
    return { comandas: fetched };
}

function attachCloseHandler(modal) {
    const closeBtn = modal.querySelector('.checkout-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.getElementById('globalOverlay');
            overlay.classList.remove('visible');
            modal.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        });
    }
}

async function processCheckout(cart) {
    const payload = getCheckoutPayload(cart);
    const data = await postOrder(payload);
    const orderId = data?.comandas?.id;
    storeOrderId(orderId);
    if (orderId) {
        return await getOrderDetails(orderId);
    }
    return data;
}

async function handleCheckoutSubmit(event, cart, saveCart, updateCartBadge, renderCart) {
    event.preventDefault();
    try {
        const result = await processCheckout(cart);
        const modal = document.getElementById('checkoutModal');
        modal.innerHTML = renderOrderDone(result);
        attachCloseHandler(modal);
    } catch (err) {
        console.error(err);
        alert(err.message || 'Error al conectar con el servidor');
        return;
    }
    cart.length = 0;
    saveCart();
    updateCartBadge();
    renderCart();
}

function openCheckoutModal(cart) {
    const overlay = document.getElementById('globalOverlay');
    const modal = document.getElementById('checkoutModal');
    modal.innerHTML = renderModalContent(cart);
    overlay.classList.add('visible');
    modal.classList.add('visible');
    document.body.classList.add('no-scroll');
}

function attachCheckoutModalEvents(cart, saveCart, updateCartBadge, renderCart) {
    const overlay = document.getElementById('globalOverlay');
    const modal = document.getElementById('checkoutModal');
    const closeBtn = modal.querySelector('.checkout-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.classList.remove('visible');
            modal.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        });
    }
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', (e) => handleCheckoutSubmit(e, cart, saveCart, updateCartBadge, renderCart));
}

export function showCheckoutModal(cart, saveCart, updateCartBadge, renderCart) {
    openCheckoutModal(cart);
    attachCheckoutModalEvents(cart, saveCart, updateCartBadge, renderCart);
}

function getHeader(title) {
    return `<header>
            <h2>${title}</h2>
            <button class="checkout-close" aria-label="Cerrar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z"/></svg></button>
        </header>`;
}