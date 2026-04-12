import express from 'express';
import cors from 'cors';
import camisetasRouter from './routes/camisetas.route.js';
import comandasRouter from './routes/comandas.route.js';

const app = express();
const PORT = 3002;

// Middlewares globales
app.use(express.json());

// Reference: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Log mínimo
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Rutas
app.use('/api/camisetas', camisetasRouter);
app.use('/api/comandas', comandasRouter);

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Error interno" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});

export default app;