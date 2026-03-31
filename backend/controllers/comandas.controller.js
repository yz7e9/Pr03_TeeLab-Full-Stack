import { loadData } from '../data/comandas.js';
import * as comandasService from '../services/comandas.service.js';

export function getAll(req, res) {
    res.json(comandasService.getAll());
}

export function getById(req, res) {
    const comandas = comandasService.getById(req.params.id);

    if (!comandas) return res.status(404).json({ message: "Not Found" });
    res.json(comandas);
}

export function create(req, res) {
    const result = comandasService.create(req.body);

    if (result.error) {
        const status = result.status || 400;
        return res.status(status).json({ message: result.error });
    }

    res.status(201).json({ message: "Created", comandas: result.data });
}

loadData();