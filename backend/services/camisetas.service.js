import { camisetas } from "../data/camisetas.js";

export function getAll(reqQuery = {}) {
    let resultado = camisetas;
    const { talla, color, tag, q, sort } = reqQuery;
    
    if (talla) {
        resultado = resultado.filter(c => c.tallas.includes(talla));
    }

    if (color) {
        resultado = resultado.filter(c => c.colores.includes(color));
    }

    if (tag) {
        resultado = resultado.filter(c => c.tags.includes(tag));
    }

    if (q) {
        const query = q.toLowerCase();
        resultado = resultado.filter(c =>
            c.nombre.toLowerCase().includes(query) ||
            c.descripcion.toLowerCase().includes(query)
        );
    }

    if (sort) {
        const sortOptions = {
            precio_asc: (a, b) => a.precioBase - b.precioBase,
            precio_desc: (a, b) => b.precioBase - a.precioBase,
            nombre_asc: (a, b) => a.nombre.localeCompare(b.nombre),
            nombre_desc: (a, b) => b.nombre.localeCompare(a.nombre),
        };
        const sortFn = sortOptions[sort];
        if (!sortFn) {
            return { error: "Tipo de ordenación no permitido (solo se acceptan: precio_asc | precio_desc | nombre_asc | nombre_desc)", status: 400 };
        }
        resultado.sort(sortFn)
    }

    return resultado;
}

export function getById(id) {
    return camisetas.find(c => c.id === id);
}
