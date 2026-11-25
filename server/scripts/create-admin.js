import bcrypt from "bcrypt";
import pool from "../config/database.js";

const createAdmin = async () => 
{
    try{
        const username = "admin";
        const email = "lucasnov210@gmail.com";
        const password = "novlucascl";

        //Vérification du compte
        const existingAdmin = await pool.query
            (
                "SELECT id FROM users WHERE email = $1 OR username = $2",
                [email, username]
            );

        if(existingAdmin.rows.length > 0) 
        {
            console.log("Ce compte existe déjà.");
            return;
        }

        //Hashé le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        //Création du compte
        await pool.query
            (
                `
                    INSERT INTO users (username, email, password, role_id)
                    VALUES ($1, $2, $3, $4)
                `,
                [username, email, hashedPassword, 1]
            );

        console.log("Compte administrateur créé avec succès.");

    }catch(error){
        console.error("Erreur lors de la création du compte:", error.message);

    }finally{
        await pool.end();
    }
};

createAdmin();