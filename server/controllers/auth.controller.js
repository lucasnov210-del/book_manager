import pool from "../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const login = async (req, res) => 
{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email et mot de passe obligatoires"
            });
        }

        const result = await pool.query(
            `
                SELECT 
                    users.id,
                    users.username,
                    users.email,
                    users.password,
                    users.role_id,
                    roles.name AS role
                FROM users
                JOIN roles ON users.role_id = roles.id
                WHERE users.email = $1;
            `, [email]
        );

        if(result.rows.length === 0){
            return res.status(401).json({
                success:false,
                message: "Email ou mot de passe incorrect"
            });
        }

        const user = result.rows[0];

        const passwordCorrect = await bcrypt.compare(
            password, 
            user.password
        );

        if(!passwordCorrect){
            return res.status(401).json({
                success:false,
                message: "Email ou mot de passe incorrect"
            });
        }

        const token = await generateToken(user);

        res.status(200).json({
            success:true,
            message: "Connexion réussie",
            token,
            user:{
                id:user.id,
                username:user.username,
                email:user.email,
                role_id:user.role_id,
                role:user.role
            }
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la connexion"
        });
    }
};

export const register =async (req, res) => 
{
    try{
        const {username, email, password} = req.body;

        //Vérifier les champs obligatoires
        if(!username || !email || !password)
        {
            return res.status(400).json({
                success:false,
                message: "Nom d'utilisateur, email, et mot de passe obligatoire"
            });
        }

        if(typeof username !== "string" || typeof email !== "string" || typeof password !== "string")
        {
            return res.status(400).json({
                success:false,
                message:"Les données envoyées sont invalides"
            });
        }

        if(password.length < 8)
        {
            return res.status(400).json({
                success:false,
                message:"Le mot de passe doit contenir au moins 8 caractères"
            });
        }

        //vérifier si l'email existe
        const existingUser = await pool.query
            (
                "SELECT id FROM users WHERE email = $1",
                [email.trim()]
            );

        if(existingUser.rows.length > 0)
        {
            return res.status(409).json({
                success:false,
                message:"Cet email existe déjà"
            });
        }

        //Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        //Créer un utilsateur avec rôle user (id=3)
        const result = await pool.query
            (
                `INSERT INTO users (username, email, password, role_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id, username, email, role_id, created_at
                `,
                [username.trim(), email.trim().toLowerCase(), hashedPassword, 3]
            );

            return res.status(201).json({
                success:true,
                message:"Inscription réussie",
                user: result.rows[0]
            });

    }catch(error){
        console.error("Erreur inscription:", error.message);

        return res.status(500).json({
            success:false,
            message:"Erreur serveur lors de l'inscription"
        });
    }
};

export const getMe = async (req, res) => 
{
    try{
        res.status(200).json({
            success:true,
            user: req.user
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message: "Erreur serveur"
        });
    }
};

export const getAllUsers = async (req,res) => 
{
    try{
        const response = await pool.query(
            "SELECT id, username, email, role_id FROM users ORDER BY created_at DESC"
        );
        res.status(200).json({
            success:true,
            users: response.rows
        });

    }catch(error){
        console.error("Erreur lors de la récupération des utilisateurs", error.message);

        res.status(500).json({
            success:false,
            message:"Erreur serveur"
        });
    }
}