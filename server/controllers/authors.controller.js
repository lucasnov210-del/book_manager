import pool from "../config/database.js";

export const getAllAuthors = async (req, res) => 
{
    try{
        const result = await pool.query(
            "SELECT id, first_name, last_name FROM authors ORDER BY last_name ASC"
        );

        res.status(200).json({
            success:true,
            authors: result.rows
        });

    }catch(error){
        console.error("Erreur lors de la récupération des auteurs:", error);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération des auteurs."
        });
    }
};