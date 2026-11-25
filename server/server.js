import  app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()")
    .then((result) => {
        console.log("Connexion PostgreSQL réussie");
        console.log("Heure de PostgreSQL: ", result.rows[0].now);

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erreur de connexion PostgreSQL:");
        console.error(err.message);
    });