import { useEffect, useState } from "react";
import api from "../services/api";

function Loans () {


    const [loans, setLoans] = useState([]);
    const [loading, setLoanding] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState("");

    useEffect(() => {
        const fetchLoans = async () => {
            try{
                const response = await api.get("/loans");

                setLoans(response.data.loans);

                const booksResponse = await api.get("/books");
                setBooks(booksResponse.data.books);

            }catch(error){
                console.error("Erreur lors du chargement des emprunts:",
                    error.response?.data || error.message
                );

                setErrorMessage(
                    error.response?.data.message || "Impossible de charger les emprunts."
                );

            }finally{
                setLoanding(false);
            }
        }
        fetchLoans();
    }, []);

    const handleCreateLoan = async (e) => {
        e.preventDefault();

        try{
            const response = await api.post("/loans", {
                book_id: Number(bookId),
            });

            alert(response.data.message || "Emprunt créé avec succès!");

            setBookId("");

            const loansResponse = await api.get("/loans");
            setLoans(loansResponse.data.loans);

        }catch(error){
            console.error("Erreur lors de la création de l'emprunt:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message || "Impossible de créer l'emprunt."
            );
        }
    };

    const handleReturnLoan = async (loanId) => {
        const confirmed = window.confirm(
            "Confirmer le retour de ce livre?"
        );

        if(!confirmed) return;

        try{
            const response = await api.put(`/loans/${loanId}/return`);

            alert(response.data.message || "Livre retourné avec succès!");

            const loansResponse = await api.get("/loans");
            setLoans(loansResponse.data.loans);

            const booksResponse = await api.get("/books");
            setBooks(booksResponse.data.books);

        }catch(error){
            console.error(
                "Erreur lors du retour du livre:",
                    error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Impossible de retourner ce livre."
            );
        }
    };

    return(
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-slate-800">
                    Gestion des emprunts
                </h1>
                <p className="mt-2 text-slate-600">
                    Consulte et gère les emprunts de la bibliothèque
                </p>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold text-slate-800">
                        Nouvel emprunt
                    </h2>

                    <form 
                        onSubmit={handleCreateLoan}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Livre
                            </label>
                            <select 
                                value={bookId}
                                onChange={(e) => setBookId(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-300 p-3"
                            >
                                <option value="">Choisir un livre</option>
                                {books.map((book) => (
                                    <option
                                        key={book.id}
                                        value={book.id}
                                    >
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                                <button 
                                    type="submit"
                                    disabled= {!bookId}
                                    className="w-full rounded-xl bg-blue-600 px-5 py-3
                                    font-semibold text-white hover:bg-blue-700 
                                    disabled:cursor-not-allowed 
                                    disabled:opacity-50"
                                >
                                    Créer l'emprunt
                                </button>
                        </div>
                    </form>
                </div>

                {loading && (
                    <p className="mt-6 text-slate-600">
                        Chargement des emprunts...
                    </p>
                )}

                {errorMessage &&(
                    <p className="mt-6 rounded-xl bg-red-100 text-red-700">
                        {errorMessage}
                    </p>
                )}

                {!loading && !errorMessage &&(
                    <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow">
                        <p className="text-slate-600">
                            Nombre d'emprunts: {loans.length}
                        </p>
                        <table className="w-full min-w-[750px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-slate-50 text-slate-600">
                                    <th className="p-3">Id</th>
                                    <th className="p-3">Livre</th>
                                    <th className="p-3">Utilisateur</th>
                                    <th className="p-3">Date d'emprunt</th>
                                    <th className="p-3">Date limite</th>
                                    <th className="p-3">Statut</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="p-3">
                                            {loan.id}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {loan.title}
                                        </td>

                                        <td className="p-3">
                                            {loan.username}
                                        </td>

                                        <td className="p-3">
                                            {new Date(loan.loan_date).toLocaleDateString("fr-FR")}
                                        </td>

                                        <td className="p-3">
                                            {new Date(loan.due_date).toLocaleDateString("fr-FR")}
                                        </td>

                                        <td className="p-3">
                                            <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium
                                                ${loan.status === "retourné" 
                                                    ? "bg-green-100 text-green-700"
                                                    : loan.status === "en retard"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                                {loan.return_date === null
                                                    ?(
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReturnLoan(loan.id)}
                                                            className="rounded-lg bg-green-600 px-3 py-2
                                                                text-sm font-semibold text-white hover:bg-green-700"
                                                        >
                                                            Retourner
                                                        </button>
                                                    ):(
                                                        <span className="text-sm text-slate-500">
                                                            Déjà retourné
                                                        </span>
                                                    )}
                                        </td>
                                    </tr>
                                ))}

                                {loans.length === 0 &&(
                                    <tr>
                                        <td colSpan="7"
                                            className="p-6 text-center text-slate-800"
                                        >
                                            Aucun emprunt.Faire une demande d'emprunt
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Loans;