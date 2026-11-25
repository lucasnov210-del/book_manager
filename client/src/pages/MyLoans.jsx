import { useEffect, useState } from "react";
import api from "../services/api";

function MyLoans () {

    const [loans, setLoans] = useState([]);
    const [loading, setLoanding] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchMyLoan = async () => {
            try{
                const response = await api.get("/loans/my");
                setLoans(response.data.loans);

            }catch(error){
                console.error(
                    "Erreur lors du chargement de mes emprunts:",
                        error.response?.data || error.message
                );

                setErrorMessage(
                    error.response?.data?.message || "Impossible de charger vos emprunts."
                );

            }finally{
                setLoanding(false);
            }
        }

        fetchMyLoan();
    }, []);

    return(
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max_w-7xl">
                <h1 className="text-3xl font-bold text-slate-800">
                    Mes emprunts
                </h1>
                <p className="mt-2 text-slate-800">
                    Consultez vos livres empruntés et leur date de retour
                </p>

                {loading && (
                    <p className="mt-6 text-slate-600">
                        Chargement de vos emprunts...
                    </p>
                )}

                {errorMessage && (
                    <p className="mt-6 text-red-700 rounded-xl bg-red-100 p-4">
                        {errorMessage}
                    </p>
                )}

                {!loading && !errorMessage && (
                    <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-6 shadow">
                        <p className="mb-4 text-slate-600">
                            Nombres de mes emprunts: {loans.length}
                        </p>
                        {loans.length === 0 ?(
                        <p className="text-slate-500">
                            Vous n'avez aucun emprunt pour le moment
                        </p>)
                        :(
                            <table className="w-full text-left">
                                <thead className="border-b text-slate-600">
                                    <tr>
                                        <th className="p-3">Livre</th>
                                        <th className="p-3">Date d'emprunt</th>
                                        <th className="p-3">Date limite</th>
                                        <th className="p-3">Date de retour</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.map((loan) => (
                                        <tr 
                                            key={loan.id}
                                            className="border-b last:border-0" 
                                        >
                                            <td className="p-3 font-medium text-slate-800">
                                                {loan.title}
                                            </td>
                                            <td className="p-3">
                                                {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString("fr-FR")
                                                : "_" }
                                            </td>
                                            <td className="p-3">
                                                    {loan.due_date 
                                                    ? new Date(loan.due_date).toLocaleDateString("fr-FR")
                                                :"_"}
                                            </td>
                                            <td className="p-3">
                                                    {loan.return_date
                                                    ? new Date(loan.return_date).toLocaleDateString("fr-FR")
                                                :"Non_retourné"}
                                            </td>
                                            <td className="p-3">
                                                    {loan.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyLoans;