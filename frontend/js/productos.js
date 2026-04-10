import { createBtnCart } from "./cart.js"

function buildQueryParams() {
    const params = new URLSearchParams();
    const size = document.getElementById('filterSize').value;
    const color = document.getElementById('filterColor').value;
    const tag = document.getElementById('filterTag').value;
    const q = document.getElementById('searchInput').value.trim();
    let sort = document.getElementById('sortBy').value;


    if (size) params.append('talla', size);
    if (color) params.append('color', color);
    if (tag) params.append('tag', tag);
    if (q) params.append('q', q);
    if (sort) params.append('sort', sort);

    return params.toString();
}

function clearProducts() {
    const section = document.getElementById('productos');
    while (section.firstChild) section.removeChild(section.firstChild);
}

function createArticle(product) {
    const articleEl = document.createElement("article");

    const title = document.createElement("h2");
    title.innerText = product.nombre;

    const description = document.createElement("p");
    description.innerText = product.descripcion;

    const price = document.createElement("p");
    price.textContent = product.precioBase.toFixed(2) + "€";

    articleEl.append(createImage(product));
    articleEl.append(title);
    articleEl.append(createTags(product));
    articleEl.append(description);
    articleEl.append(price);
    articleEl.append(createSelectorSize(product));
    articleEl.append(createSelectorColor(product));
    articleEl.append(createAmount(product));
    articleEl.append(createBtnCart(product));
    return articleEl;
}

function createImage(product) {
    const img = document.createElement("img");
    img.id = product.nombre.toLowerCase() + "-img";
    img.src = product.imagenes[product.colores[0]];
    img.alt = product.nombre;
    return img;
}

function createTags(product) {
    const tags = document.createElement("div");
    tags.className = "tag";
    product.tags.forEach(tag => {
        const tagEl = document.createElement("h3");
        tagEl.textContent = tag;
        tags.append(tagEl);
    });
    return tags;
}

function createSelectorSize(product) {
    const select = document.createElement("select");
    select.id = product.nombre.toLowerCase() + "-tallas-select";
    product.tallas.forEach(talla => {
        const option = document.createElement("option");
        option.value = talla;
        option.textContent = talla;
        select.appendChild(option);
    });
    return select;
}

function createSelectorColor(product) {
    const select = document.createElement("select");
    select.id = product.nombre.toLowerCase() + "-colores-select";
    product.colores.forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        select.appendChild(option);
    });

    // Referencia: https://stackoverflow.com/questions/35608113/change-image-src-onchange-og-select
    select.addEventListener("change", (e) => {
        const img = document.getElementById(product.nombre.toLowerCase() + "-img");
        img.src = product.imagenes[e.target.value];
    });
    return select;
}

function createAmount(product) {
    const div = document.createElement("div");
    const minus = document.createElement("button");
    minus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>`;
    const plus = document.createElement("button");
    plus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`;
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = product.nombre.toLowerCase() + "-quantity";
    quantity.setAttribute("readonly", true);
    quantity.value = 0;
    minus.addEventListener('click', () => { if (quantity.value > 0) quantity.value--; });
    plus.addEventListener('click', () => quantity.value++);
    div.append(minus, quantity, plus);
    return div;
}

async function fetchAndRender() {
    const query = buildQueryParams();
    const url = `http://localhost:3001/api/camisetas${query ? '?' + query : ''}`;
    const resp = await fetch(url);
    const data = await resp.json();
    clearProducts();
    const section = document.getElementById('productos');
    if (Array.isArray(data)) {
        data.forEach(p => section.appendChild(createArticle(p)));
    } else {
        console.error('Unexpected response format', data);
    }
}

function attachListeners() {
    const sizeEl = document.getElementById('filterSize');
    const colorEl = document.getElementById('filterColor');
    const tagEl = document.getElementById('filterTag');
    const searchEl = document.getElementById('searchInput');
    const sortEl = document.getElementById('sortBy');

    const handler = () => fetchAndRender();

    sizeEl && sizeEl.addEventListener('change', handler);
    colorEl && colorEl.addEventListener('change', handler);
    tagEl && tagEl.addEventListener('change', handler);
    searchEl && searchEl.addEventListener('input', handler);
    sortEl && sortEl.addEventListener('change', handler);
}

export function initProductos() {
    attachListeners();
    fetchAndRender();
}
