const productosJSON = `[
    {
        "id": "TSH01",
        "nombre": "MACACARENA",
        "descripcion": "Quan balles sense vergonya i el ritme et domina.",
        "precioBase": 19.95,
        "tallas": ["S", "M", "L", "XL"],
        "colores": ["mostaza", "negro", "blanco"],
        "imagenes": {
            "mostaza": "img/MACACARENA.png",
            "negro": "img/MACACARENA_BLACK.png",
            "blanco": "img/MACACARENA_WHITE.png"
        },
        "tags": ["nuevo"]
    },
    {
        "id": "TSH02",
        "nombre": "NINETIES MODE",
        "descripcion": "Un homenatge pixelat als anys 90.",
        "precioBase": 21.50,
        "tallas": ["S", "M", "L", "XL", "XXL"],
        "colores": ["gris", "negro"],
        "imagenes": {
            "gris": "img/NINETIES.png",
            "negro": "img/NINETIES_BLACK.png"
        },
        "tags": ["retro"]
    },
    {
        "id": "TSH03",
        "nombre": "RESERVOIR INVADERS",
        "descripcion": "Quan Tarantino coneix els videojocs clàssics.",
        "precioBase": 22.90,
        "tallas": ["M", "L", "XL"],
        "colores": ["azul", "negro"],
        "imagenes": {
            "azul": "img/RESERVOIR.png",
            "negro": "img/RESERVOIR_BLACK.png"
        },
        "tags": ["edicion-especial"]
    },
    {
        "id": "TSH04",
        "nombre": "VITRUVIAN CODE",
        "descripcion": "Art, codi i proporció perfecta.",
        "precioBase": 24.00,
        "tallas": ["S", "M", "L", "XL"],
        "colores": ["blanco", "negro"],
        "imagenes": {
            "blanco": "img/VITRUVIAN.png",
            "negro": "img/VITRUVIAN_BLACK.png"
        },
        "tags": ["premium"]
    }
]`;

function init() {
    muestraProductos(JSON.parse(productosJSON))
}

function muestraProductos(listaProductos) {
    const seccionProductos = document.getElementById("productos");

    listaProductos.forEach(producto => {
        seccionProductos.append(crearArticulo(producto));
    });
}

function crearArticulo(articulo) {
    console.log(articulo)
    const articuloEl = document.createElement("article");

    const titulo = document.createElement("h2");
    titulo.innerText = articulo.nombre;

    const descripcion = document.createElement("p");
    descripcion.innerText = articulo.descripcion;

    const precio = document.createElement("p");
    precio.textContent = articulo.precioBase + "€";

    articuloEl.append(crearImagen(articulo));
    articuloEl.append(titulo);
    articuloEl.append(crearTags(articulo));
    articuloEl.append(descripcion);
    articuloEl.append(precio);
    articuloEl.append(crearSelectorTallas(articulo));
    articuloEl.append(crearSelectorColores(articulo));
    articuloEl.append(crearQuantitat());
    articuloEl.append(crearBtnCesta());
    return articuloEl
}

function crearImagen(articulo) {
    const imagen = document.createElement("img");
    imagen.id = articulo.nombre.toLowerCase() + "-img";
    imagen.src = articulo.imagenes[articulo.colores[0]];
    imagen.alt = articulo.nombre;
    return imagen;
}

function crearTags(articulo) {
    const tags = document.createElement("div");
    tags.className = "tag";
    articulo.tags.forEach(tag => {
        const tagEl = document.createElement("h3");
        tagEl.textContent = tag;
        tags.append(tagEl);
    })
    return tags;
}

function crearSelectorTallas(articulo) {
    const select = document.createElement("select");
    select.id = articulo.nombre.toLowerCase() + "-tallas-select";

    articulo.tallas.forEach(talla => {
        const option = document.createElement("option");
        option.value = talla;
        option.textContent = talla;
        select.appendChild(option);
    });

    return select;
}

function crearSelectorColores(articulo) {
    const select = document.createElement("select");
    select.id = articulo.nombre.toLowerCase() + "-colores-select";

    articulo.colores.forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        select.appendChild(option);
    });

    // Referencia: https://stackoverflow.com/questions/35608113/change-image-src-onchange-og-select
    select.addEventListener("change", (e) => {
        const img = document.getElementById(articulo.nombre.toLowerCase() + "-img");
        img.src = articulo.imagenes[e.target.value];
    });

    return select;
}

function crearQuantitat() {
    const quantitatDiv = document.createElement("div");
    const menos = document.createElement("input");
    menos.type = "button";
    menos.value = "-";

    const mas = document.createElement("input");
    mas.type = "button";
    mas.value = "+";

    const valor = document.createElement("input");
    valor.type = "number";
    valor.setAttribute("readonly", true);
    valor.value = 0;

    menos.addEventListener("click", () => {
        if (valor.value - 1 >= 0) {
            valor.value--;
        }
    });
    mas.addEventListener("click", () => valor.value++);

    quantitatDiv.append(menos);
    quantitatDiv.append(valor);
    quantitatDiv.append(mas);
    return quantitatDiv;
}

function crearBtnCesta() {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Añadir al carrito";
    btn.className = "btn-cesta";
    return btn;
}
