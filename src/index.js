import { app, connectDatabase } from "./app.js";
import config from "./config/config.js";

const port = config.port;

async function startServer() {
    await connectDatabase()
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
}

startServer();