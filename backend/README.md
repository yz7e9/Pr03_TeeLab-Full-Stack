# Pr02 TeeLab API REST

## Installation

```bash
npm install
```

## Running the server

Running the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The server will be available at `http://localhost:3001`.

## API Endpoints

- **GET** `/api/camisetas` – Retrieve all camisetas.
- **GET** `/api/camisetas/:id` – Retrieve a specific camiseta by its ID.
- **GET** `/api/comandas` – Retrieve all comandas.
- **GET** `/api/comandas/:id` – Retrieve a specific comanda by its ID.
- **POST** `/api/comandas` – Create a new comanda (send JSON in the request body).
