import fs from "fs/promises";

export let comandas = [];

let currentID = 1;
const filePath = "./data/comandas.json";

export function nextID() {
    const id = String(currentID).padStart(4, '0');
    currentID++;
    return `ORD-${id}`;
}

export async function loadData() {
    try {
        const json = await fs.readFile(filePath, "utf-8").catch(() => "[]");
        comandas = JSON.parse(json);

        const last = comandas.at(-1);
        if (last?.id) {
            const num = parseInt(last.id.replace("ORD-", ""), 10);
            if (!isNaN(num)) currentID = num + 1;
        }
    } catch (err) {
        console.error("Error loading data:", err);
        comandas = [];
    }
}

export async function saveData(data) {
    try {
        // Leer archivo; si no existe o está vacío, inicializar con "[]"
        let json = await fs.readFile(filePath, "utf-8").catch(err => {
            if (err.code === "ENOENT") return "[]";
            throw err;
        });

        if (!json.trim()) json = "[]";  // <-- Maneja archivo vacío

        comandas = JSON.parse(json);
        comandas.push(data);

        await fs.writeFile(filePath, JSON.stringify(comandas, null, 2));
        console.log("Comanda added!");
    } catch (err) {
        console.error("Error writing file:", err);
    }
}