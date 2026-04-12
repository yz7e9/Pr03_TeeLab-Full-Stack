# TeeLab Full-Stack

## How to start the **backend**

1. Open a terminal and change to the `backend` directory:

```bash
cd backend
```

2. Install the Node.js dependencies:

```bash
npm install
```

3. Run the server:
   - Development (auto‑restart on changes):

    ```bash
    npm run dev
    ```

   - Production:

    ```bash
    npm start
    ```

4. The API will be listening on **http://localhost:3002**. You should see a log like:

```log
Servidor corriendo en http://localhost:3002/
```

---

## How to start the **frontend**

The frontend consists of static HTML, CSS and JavaScript files.

- **Quick test**: Open `frontend/index.html` directly in a browser.
  
> [!NOTE]
> Some browsers may block API calls due to CORS.
  
- **Recommended**: Serve the folder with a static web server, e.g. using `serve`:
  
```bash
npx serve frontend
```

   The site will be reachable at `http://localhost:3000` (or the shown port). The frontend talks to the backend at `http://localhost:3002`.

---

## Used API endpoints

| Method   | URL                                      | Description                                                                                                                                                  |
| -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **GET**  | `http://localhost:3002/api/camisetas`    | List T‑shirts. Supports optional query parameters: `talla`, `color`, `tag`, `q` (search), `sort` (`precio_asc`, `precio_desc`, `nombre_asc`, `nombre_desc`). |
| **GET**  | `http://localhost:3002/api/comandas/:id` | Get order details by order ID.                                                                                                                               |
| **POST** | `http://localhost:3002/api/comandas`     | Create a new order.                                                                                                                                          |

JSON body example of an POST request:

```json
{
  "cliente": { "nombre": "Ana", "email": "ana@mail.com" },
  "direccion": { "calle": "Carrer Major 1", "cp": "08400", "ciudad": "Granollers" },
  "items": [
    { "camisetaId": "TSH01", "talla": "M", "color": "negro", "cantidad": 2 },
    { "camisetaId": "TSH02", "talla": "L", "color": "gris", "cantidad": 1 }
  ]
}
```

Returns `201 Created` with the created order summary.

---

## Video

![Pr03_TeeLab-Full-Stack](./Pr03_TeeLab-Full-Stack.mp4)
