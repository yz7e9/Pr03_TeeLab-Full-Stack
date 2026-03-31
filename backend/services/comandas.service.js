import { comandas, nextID, loadData, saveData } from "../data/comandas.js";
import { getAll as camisetaGetAll } from "./camisetas.service.js";

function validateComanda(obj) {
    if (!obj || typeof obj !== "object") return "Body inválido";
    if (!obj.cliente || typeof obj.cliente !== "object") return "Falta el objeto cliente";
    
    const clienteValidation = validateCliente(obj.cliente);
    if (clienteValidation) return clienteValidation;
    
    if (!Array.isArray(obj.items) || obj.items.length === 0) {
        return "items debe tener al menos 1 elemento";
    }
    
    for (let i = 0; i < obj.items.length; i++) {
        const item = obj.items[i];
        const itemValidation = validateItem(item, i);
        if (itemValidation) return itemValidation;
    }
    
    return null;
}

function validateCliente(cliente) {
    const { nombre, email } = cliente;
    
    if (!nombre || nombre.length < 2) {
        return "cliente.nombre obligatorio (mín. 2 caracteres)";
    }
    
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return "cliente.email obligatorio (formato inválido)";
    }
    
    return null;
}

function validateItem(item, index) {
    if (!item.camisetaId) {
        return `items[${index}].camisetaId es obligatorio`;
    }

    const camiseta = camisetaGetAll().find(c => c.id === item.camisetaId);
    if (!camiseta) {
        return `items[${index}].camisetaId no existe en catálogo`;
    }
    
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
        return `items[${index}].cantidad debe ser un entero ≥ 1`;
    }
    
    if (!item.talla || !camiseta.tallas.includes(item.talla)) {
        return `items[${index}].talla no válida`;
    }
    
    if (!item.color || !camiseta.colores.includes(item.color)) {
        return `items[${index}].color no válido`;
    }
    
    return null;
}

export function getAll() {
    return comandas;
}

export function getById(id) {
    return comandas.find(c => c.id === id);
}

export function create(newComanda) {
    const validationMsg = validateComanda(newComanda);
    if (validationMsg) return { error: validationMsg };

    const camisetas = camisetaGetAll();
    const itemsProcesados = [];
    let total = 0;

    for (let i = 0; i < newComanda.items.length; i++) {
        const item = newComanda.items[i];
        const camiseta = camisetas.find(c => c.id === item.camisetaId);

        const precioUnitario = camiseta.precioBase;
        const subtotal = precioUnitario * item.cantidad;

        total += subtotal;

        itemsProcesados.push({
            camisetaId: camiseta.id,
            nombre: camiseta.nombre,
            talla: item.talla,
            color: item.color,
            cantidad: item.cantidad,
            precioUnitario: camiseta.precioBase,
            subtotal: subtotal
        });
    }

    const nuevaComanda = {
        id: nextID(),
        fecha: new Date().toISOString(),
        estado: "recibida",
        cliente: newComanda.cliente,
        direccion: newComanda.direccion,
        items: itemsProcesados,
        total: total
    };

    comandas.push(nuevaComanda);
    saveData(nuevaComanda);

    const nuevaComandaReturn = {
        id: nuevaComanda.id,
        fecha: nuevaComanda.fecha,
        estado: nuevaComanda.estado,
        items: nuevaComanda.items,
        total: nuevaComanda.total
    };

    return { data: nuevaComandaReturn };
}

loadData();