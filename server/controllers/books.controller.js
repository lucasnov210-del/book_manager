import pool from "../config/database.js";

export const getBooks = async (req, res) => 
{
    try{
        const result = await pool.query(
            `
            SELECT 
                books.id,
                books.title,
                books.cover_url,
                books.isbn,
                books.publication_year,
                books.quantity,
                books.available_quantity,
            authors.first_name AS author_first_name,
            authors.last_name AS author_last_name,
            categories.name AS category
                FROM books
                JOIN authors ON books.author_id = authors.id
                JOIN categories ON books.category_id = categories.id
                ORDER BY books.id;
            `
        );

        res.status(200).json({
            success: true,
            books: result.rows
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des livres"
        });
    }
};

export const getBookById = async (req, res) => 
{
    try{
        const {id} = req.params;

        const result = await pool.query(
            `
                SELECT
                    books.id,
                    books.title,
                    books.isbn,
                    books.publication_year,
                    books.quantity,
                    books.available_quantity,
                authors.first_name AS author_first_name,
                authors.last_name AS author_last_name,
                    categories.name AS category
                FROM books
                JOIN authors ON books.author_id= authors.id
                JOIN categories ON books.category_id= categories.id
                WHERE books.id = $1;
            `,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message: "Livre introuvable"
            });
        }

        res.status(200).json({
            success:true,
            book:result.rows[0]
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération du livre"
        });
    }
};

export const createBook = async (req, res) => 
{
    try{
        const{
            title,
            publication_year,
            quantity,
            author_id,
            category_id
        } = req.body;

        if(!title || !quantity || !author_id || !category_id){
            return res.status(400).json({
                success:false,
                message: "Les champs obligatoires sont manqaunts"
            });
        }

        const bookCode = Date.now().toString();

        const result = await pool.query(
            `
                INSERT INTO books(
                    title,
                    isbn,
                    publication_year,
                    quantity,
                    available_quantity,
                    author_id,
                    category_id
                )
                VALUES(
                    $1, $2, $3, $4, $4, $5, $6
                )
                RETURNING *;
            `,[
                    title,
                    bookCode,
                    publication_year || null,
                    quantity,
                    author_id,
                    category_id
            ]
        );

        res.status(201).json({
            success:true,
            message: "Livre créé avec succès",
            book: result.rows[0]
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la création du livre"
        });
    }
};

export const updateBook = async (req, res) => 
{
    try{
        const {id} = req.params;

        const {
            title,
            publication_year,
            quantity,
            author_id,
            category_id
        } = req.body;

        if(!title || !quantity || !author_id || !category_id){
            return res.status(400).json({
                success:false,
                message: "Les champs obligatoires sont manqaunts"
            });
        }

        const bookResult = await pool.query(
            `
                SELECT 
                    quantity,
                    available_quantity
                FROM books
                WHERE id = $1;
            `,[id]
        );

        if(bookResult.rows.length === 0){
            return res.status(404).json({
                success:false,
                message: "Livre introuvable"
            });
        }

        const book = bookResult.rows[0];

        const borrowedQuantity = book.quantity - book.available_quantity;

        if(quantity < borrowedQuantity){
            return res.status(400).json({
                success:false,
                message: `Impossible de réduire la quantité à 
                ${quantity}. ${borrowedQuantity}
                exemplaire(s) sont actuellement emprunté(s)`
            });
        };

        const newAvailableQuantity = quantity - borrowedQuantity;

        const result = await pool.query(
            `
                UPDATE books 
                SET
                    title= $1,
                    publication_year= $2,
                    quantity= $3,
                    available_quantity = $4,
                    author_id= $5,
                    category_id= $6
                WHERE id = $7
                RETURNING *;
            `,[
                title,
                publication_year || null,
                quantity,
                newAvailableQuantity,
                author_id,
                category_id,
                id
            ]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message: "Livre introuvable"
            });
        }

        res.status(200).json({
            success:true,
            message: "Livre modifé avec succès",
            book: result.rows[0]
        });

    }catch(err) {
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la modification du livre"
        });
    }
};

export const deleteBook = async (req, res) => 
{
    try{
        const {id} = req.params;

        const activeLoanResult = await pool.query(
            `
                SELECT id
                FROM loans
                WHERE book_id = $1
                    AND return_date IS NULL;
            `,[id]
        );

        if(activeLoanResult.rows.length > 0){
            return res.status(400).json({
                success:false,
                message: "Impossible de supprimer ce livre car il est actuellement emprunté"
            });
        }
        
        const result = await pool.query(
            `
                DELETE FROM books 
                WHERE id= $1
                RETURNING *;
            `,[id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message: "Livre introuvable"
            });
        }

        res.status(200).json({
            success:true,
            message: "Livre supprimé avec succès",
            book: result.rows[0]
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la suppréssion du livre"
        });
    }
};