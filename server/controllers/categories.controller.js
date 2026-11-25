import pool from "../config/database.js";

export const getAllCategories = async (req, res) => 
{
    try{
        const result = await pool.query(
            "SELECT id, name FROM categories ORDER BY name ASC"
        );

        res.status(200).json({
            success:true,
            categories: result.rows
        });

    }catch(error){
        console.error("Erreur lors de la récupération des caégories:", error);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération des catégories."
        });
    }
};