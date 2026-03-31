import * as camisetasService from '../services/camisetas.service.js';

export function getAll(req, res) {
    res.json(camisetasService.getAll(req.query));
}

export function getById(req, res) {
    const camisetas = camisetasService.getById(req.params.id);

    if (!camisetas) return res.status(404).json({ message: "Camiseta no encontrada" });
    res.json(camisetas);
}
