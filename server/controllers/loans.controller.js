import pool from "../config/database.js";

export const createLoan = async (req, res) => 
{
    const client = await pool.connect();

    try{
        const {book_id} = req.body;

        const user_id = req.user.id;

        await client.query("BEGIN");

        const activeLoanResult = await client.query(
            `
                SELECT id
                FROM loans
                WHERE user_id =$1
                    AND book_id = $2
                    AND return_date IS NULL;
            `,[user_id, book_id]
        );

        if(activeLoanResult.rows.length > 0){

            await client.query("ROLLBACK");

            return res.status(400).json({
                success:false,
                message: "Vous avez déjà ce livre en cours d'emprunt"
            });
        }

        const bookResult = await client.query(
            `
                SELECT 
                    id,
                    title,
                    quantity,
                    available_quantity
                FROM books
                WHERE id = $1
                FOR UPDATE;
            `, [book_id]
        );

        if(bookResult.rows.length === 0){
            await client.query("ROLLBACK");
            return res.status(404).json({
                success:false,
                message: "Livre introuvable"
            });
        }

        const book = bookResult.rows[0];

        if(book.available_quantity <= 0){
            await client.query("ROLLBACK");
            return res.status(400).json({
                success:false,
                message: "Aucun exemplaire disponible"
            });
        }

        const loanResult = await client.query(
            `
                INSERT INTO loans(
                    user_id,
                    book_id,
                    due_date
                )
                    VALUES(
                        $1,
                        $2,
                        CURRENT_TIMESTAMP + INTERVAL '7 days'
                    )
                RETURNING *;
            `, [user_id, book_id]
        );

        await client.query(
            `
            UPDATE books
            SET available_quantity = available_quantity - 1
            WHERE id = $1;
            `, [book_id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success:true,
            message: "Livre emprunté avec succès",
            loan: loanResult.rows[0]
        });

    }catch(err){
        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la création du prêt"
        });

    }finally{
        client.release();
    }
};

export const getLoans = async (req, res) => 
{
    try{
        const result = await pool.query(
            `
                SELECT
                    loans.id,
                    loans.loan_date,
                    loans.due_date,
                    loans.return_date,
                        CASE 
                            WHEN loans.return_date IS NOT NULL 
                                THEN 'retourné'
                            WHEN loans.due_date < CURRENT_TIMESTAMP 
                                THEN 'en retard'
                            ELSE 'en cours'
                        END AS status,
                    users.id AS user_id,
                    users.username AS username,
                    books.id AS book_id,
                    books.title
                FROM loans
                JOIN users ON loans.user_id = users.id
                JOIN books ON loans.book_id = books.id
                ORDER BY loans.loan_date
                DESC;
            `
        );

        res.status(200).json({
            success:true,
            loans: result.rows
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération des prêts"
        });
    }
};

export const returnLoan = async (req, res) => 
{
    const client = await pool.connect();

    try{
        const {id} = req.params;

        await client.query("BEGIN");

        const loanResult = await client.query(
            `   
                SELECT 
                    loans.id,
                    loans.book_id,
                    loans.user_id,
                    loans.return_date
                FROM loans
                WHERE loans.id= $1
                FOR UPDATE;
            `, [id]
        );

        if(loanResult.rows.length === 0){
            await client.query("ROLLBACK");

            return res.status(404).json({
                success:false,
                message: "Prêt introuvable"
            });
        }

        const loan = loanResult.rows[0];

        const isAdminOrLibrarian = req.user.role === "admin" ||req.user.role === "librarian";

        if(!isAdminOrLibrarian && loan.user_id !== req.user.id){
            await client.query("ROLLBACK");

            return res.stats(403).json({
                success:false,
                message: "Vous ne pouvez retourner que vos propres prêts"
            })
        }

        if(loan.return_date !== null){
            await client.query("ROLLBACK");
            return res.status(400).json({
                success:false,
                message: "Ce livre a déjà été retourné"
            });
        }

        await client.query(
            `
                UPDATE loans SET return_date = CURRENT_TIMESTAMP 
                WHERE id = $1;
            `, [id]
        );

        await client.query(
            `
                UPDATE books SET available_quantity= available_quantity + 1
                WHERE id = $1;
            `, [loan.book_id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            success:true,
            message: "Livre retourné avec succès"
        });

    }catch(err){
        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors du retour du livre"
        });

    }finally{
        client.release();
    }
};

export const getMyLoans = async (req, res) =>
{
    try{
        const user_id = req.user.id;

        const result = await pool.query(
            `
                SELECT
                    loans.id,
                    loans.loan_date,
                    loans.due_date,
                    loans.return_date,
                        CASE 
                            WHEN loans.return_date IS NOT NULL 
                                THEN 'retourné'
                            WHEN loans.due_date < CURRENT_TIMESTAMP 
                                THEN 'en retard'
                        ELSE 'en cours'
                        END AS status,
                    books.id AS book_id,
                    books.title
                FROM loans
                JOIN books ON loans.book_id = books.id
                WHERE loans.user_id = $1
                ORDER BY loans.loan_date
                DESC;
            `, [user_id]
        );

        res.status(200).json({
            success:true,
            loans: result.rows
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération de vos prêts"
        });
    }
};

export const getOverdueLoans = async (req, res) => 
{
    try{
        const result = await pool.query(
            `
                SELECT 
                    loans.id,
                    loans.loan_date,
                    loans.due_date,
                    loans.return_date,
                    users.id AS user_id,
                    users.username,
                    users.email,
                    books.id AS book_id,
                    books.title
                FROM loans
                JOIN users ON loans.user_id = users.id
                JOIN books ON loans.book_id = books.id
                WHERE loans.return_date IS NULL
                    AND loans.due_date < CURRENT_TIMESTAMP
                ORDER BY loans.due_date ASC;

            `
        );

        res.status(200).json({
            success:true,
            loans: result.rows
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message: "Erreur lors de la récupération des prêts en retard"
        });
    }
};

export const getLoanStats = async (req, res) => 
{
    try{
        const result = await pool.query(
            `
                SELECT 
                    COUNT(*) FILTER(
                        WHERE return_date IS NULL
                            AND due_date >= CURRENT_TIMESTAMP) ::integer AS active_loans,
                    COUNT(*) FILTER(
                        WHERE return_date IS NULL) ::integer AS returned_loans,
                    COUNT(*) FILTER(
                        WHERE return_date IS NULL
                            AND due_date < CURRENT_TIMESTAMP) ::integer AS overdue_loans
                FROM loans;
            `
        );

        res.status(200).json({
            success:true,
            stats: result.rows[0]
        });

    }catch(err){
        console.error(err);

        res.stats(500).json({
            success:false,
            message: "Erreur lors de la récupération des statistiques"
        });
    }
};