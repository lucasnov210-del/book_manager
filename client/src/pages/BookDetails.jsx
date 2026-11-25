import { useEffect, useState } from "react";
import {useParams , useNavigate} from "react-router-dom";
import {ArrowLeft, BookOpen, LoaderCircle} from "lucide-react";
import api from "../services/api";

function BookDetails() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBook = async () => {
            try{
                setLoading(true);
                setError("");
                setBook(null);

                const response = await api.get(`/books/${id}`);

                setBook(response.data.book);

            }catch(error){
                console.error("Erreur lors de la récupération du livre:", error.response?.status,
                    error.response?.data || error.message
                );

                if(error.response?.status === 401) {

                    setError("Votre session a expiré.Veuillez vous reconnecter");

                }else if (error.response?.status === 404) {
                    setError("Livre introuvable.Vérifiez l'identifiant du livre.");

                }else{
                    setError("Impossible de récupérer les détails du livre.")
                }

            }finally{
                setLoading(false);
            }
        };
        fetchBook();

    }, [id]);

    if(loading) {
        return(
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="flex items-center gap-3 text-slate-600">
                    <LoaderCircle size={28}
                        className="animate-spin" />
                    <p className="text-lg font-medium">
                        Chargement du livre...
                    </p>
                </div>
            </div>
        );
    }

    if(error) {
        return(
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
                <p className="mb-6 text-center font-semibold text-red-600">
                    {error}
                </p>

                {error.includes("session a expiré") ?(
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/", {replace: true});
                            window.location.reload();
                        }}
                        className="rounded-xl bg-red-600 px-5 py-3 font_semibold text-white hover:bg-red-700"
                    >
                        Retour à la connexion
                    </button>

                ):(
                    <button
                        onClick={() => 
                            navigate("/books")
                        }
                        className="rounded-xl bg-slate-800 px-5 py-3 font-semibolg text-white hover:bg-slate-700"
                    >
                        Retour aux livres
                    </button>
                )}
            </div>
        );
    }

    if(!book) {
        return null;
    }

    return(
        <div className="min-h-screen bg-slatr-100 p-6">
            <div className="mx-auto max-w-4xl">
                <button
                    onClick={() => navigate("/books")}
                    className="mb-6 flex items-center gap-2 rounded-xl bg-white px-4 py-2
                    font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200"
                >
                    <ArrowLeft size={20} />
                    Retour aux livres
                </button>

                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="bg-slate-800 p-8 text-white">
                        <div className="mb-3 flex items-center gap-3">
                            <BookOpen size={32} />
                            <span className="text-sm font-medium uppercase tracking-wider text-slate-300">
                                Détails du livre
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold">
                            {book.title}
                        </h1>
                        <p className="mt-2 text-slate-300">
                            Par {book.author_first_name}{" "} {book.author_last_name}
                        </p>
                    </div>

                    <div className="grid gap-6 p-8 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-slate-500">
                                Auteur
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.author_first_name} {" "} {book.author_last_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Catégorie
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.category || "Non renseignée"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Année de publication
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.publication_year}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                ISBN
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.isbn}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Quantité
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.quantity}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Exemplaires disponibles
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {book.available_quantity}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BookDetails;