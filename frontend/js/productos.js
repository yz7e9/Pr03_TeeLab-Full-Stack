import { createBtnCart } from "./cart.js"
import { serverURL, createEl } from "./script.js";

const minusIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>`;
const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`;


function buildQueryParams() {
    const params = new URLSearchParams();
    try {
        params.append('talla', document.getElementById('filterSize').value);
        params.append('color', document.getElementById('filterColor').value);
        params.append('tag', document.getElementById('filterTag').value);
        params.append('q', document.getElementById('searchInput').value.trim());
        params.append('sort', document.getElementById('sortBy').value);
    } catch (e) {
        console.error('Error building query params:', e);
    }
    return params.toString()
}

function clearProducts() {
    try {
        const section = document.getElementById('productos');
        while (section.firstChild) section.removeChild(section.firstChild);
    } catch (e) {
        console.error('Error clearing products section:', e);
    }
}

function createArticle(product) {
    const article = document.createElement("article");
    article.append(
        createImage(product),
        createEl("h2", { innerText: product.nombre }),
        createTags(product),
        createEl("p", { innerText: product.descripcion }),
        createEl("p", { textContent: product.precioBase.toFixed(2) + "€" }),
        createSelectorSize(product),
        createSelectorColor(product),
        createAmount(product),
        createBtnCart(product)
    );
    return article;
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
    select.addEventListener("change", (e) => document.getElementById(product.nombre.toLowerCase() + "-img").src = product.imagenes[e.target.value]);
    return select;
}

function createAmount(product) {
    const div = createEl("div");
    const quantity = createEl("input", {
        type: "number",
        id: `${product.nombre.toLowerCase()}-quantity`,
        value: 0,
        readOnly: true
    });
    const minus = createEl("button", { innerHTML: minusIcon });
    const plus = createEl("button", { innerHTML: plusIcon });
    minus.onclick = () => quantity.value = Math.max(0, +quantity.value - 1);
    plus.onclick = () => quantity.value++;
    div.append(minus, quantity, plus);
    return div;
}

async function fetchAndRender() {
    try {
        const query = buildQueryParams();
        const url = `${serverURL}/api/camisetas${query ? '?' + query : ''}`;
        const resp = await fetch(url);
        const data = await resp.json();
        clearProducts();
        const section = document.getElementById('productos');
        data.forEach(p => section.appendChild(createArticle(p)));
    } catch (e) {
        console.error('Error fetching and rendering products:', e);
    }
}

function attachListeners() {
    try {
        const handler = () => fetchAndRender();
        [
            ["filterSize", "change"],
            ["filterColor", "change"],
            ["filterTag", "change"],
            ["searchInput", "input"],
            ["sortBy", "change"]
        ].forEach(([id, event]) => document.getElementById(id)?.addEventListener(event, handler));
    } catch (e) {
        console.error("Error attaching filter listeners:", e);
    }
}

export function initProducts() {
    attachListeners();
    fetchAndRender();
}
