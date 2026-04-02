async function init() {
    const response = await fetch("http://localhost:3001/api/camisetas");
    const productsJSON = await response.json();

    displayProducts(productsJSON);
}

function displayProducts(productList) {
    const productSection = document.getElementById("productos");

    productList.forEach(product => {
        productSection.append(createArticle(product));
    });
}

function createArticle(article) {
    console.log(article)
    const articleEl = document.createElement("article");

    const title = document.createElement("h2");
    title.innerText = article.nombre;

    const description = document.createElement("p");
    description.innerText = article.descripcion;

    const price = document.createElement("p");
    price.textContent = article.precioBase.toFixed(2) + "€";

    articleEl.append(createImage(article));
    articleEl.append(title);
    articleEl.append(createTags(article));
    articleEl.append(description);
    articleEl.append(price);
    articleEl.append(createSelectorSize(article));
    articleEl.append(createSelectorColor(article));
    articleEl.append(createAmount(article));
    return articleEl
}

function createImage(article) {
    const image = document.createElement("img");
    image.id = article.nombre.toLowerCase() + "-img";
    image.src = article.imagenes[article.colores[0]];
    image.alt = article.nombre;
    return image;
}

function createTags(article) {
    const tags = document.createElement("div");
    tags.className = "tag";
    article.tags.forEach(tag => {
        const tagEl = document.createElement("h3");
        tagEl.textContent = tag;
        tags.append(tagEl);
    })
    return tags;
}

function createSelectorSize(article) {
    const select = document.createElement("select");
    select.id = article.nombre.toLowerCase() + "-tallas-select";

    article.tallas.forEach(talla => {
        const option = document.createElement("option");
        option.value = talla;
        option.textContent = talla;
        select.appendChild(option);
    });

    return select;
}

function createSelectorColor(article) {
    const select = document.createElement("select");
    select.id = article.nombre.toLowerCase() + "-colores-select";

    article.colores.forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        select.appendChild(option);
    });

    // Referencia: https://stackoverflow.com/questions/35608113/change-image-src-onchange-og-select
    select.addEventListener("change", (e) => {
        const img = document.getElementById(article.nombre.toLowerCase() + "-img");
        img.src = article.imagenes[e.target.value];
    });

    return select;
}

function createAmount(article) {
    const amountDiv = document.createElement("div");
    const minus = document.createElement("button");
    minus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>`;

    const plus = document.createElement("button");
    plus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`;

    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.id = article.nombre.toLowerCase() + "-quantity";
    quantity.setAttribute("readonly", true);
    quantity.value = 0;

    minus.addEventListener("click", () => {
        if (quantity.value - 1 >= 0) {
            quantity.value--;
        }
    });
    plus.addEventListener("click", () => quantity.value++);

    amountDiv.append(minus);
    amountDiv.append(quantity);
    amountDiv.append(plus);
    return amountDiv;
}