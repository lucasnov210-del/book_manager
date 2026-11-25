import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {
    LibraryBig,
    BookOpen,
    Search,
    LogIn,
    ArrowRight,
    UserPlus,
    BookMarked,
    LoaderCircle
} from "lucide-react";
import api from "../services/api";

function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try{
                const response = await api.get("/books");

                const data = response.data;
                const bookList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.books)
                    ? data.books
                    : Array.isArray(data.data)
                    ? data.data
                    : [];

                setBooks(bookList.slice(0,6));

            }catch(err){
                console.error("Erreur de chargement des livres:", err);

                setError("Le catalogue est momentanément indisponible.");

            }finally{
                setLoading(false);
            }
        };

        fetchBooks();
    },[]);

    return(
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/*Navigation */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4
                    px-4 py-4 sm:px-6 lg:px-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl
                                bg-blue-600 text-white shadow-md">
                                    <LibraryBig size={25} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">
                                    Library Manager
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Lire, découvrir, apprendre
                                </p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-6 md:flex">
                            <a 
                                href="#accueil"
                                className="text-sm font-medium text-slate-600 hover:text-blue-600"
                                >
                                Accueil
                            </a>
                             <a 
                                href="#catalogue"
                                className="text-sm font-medium text-slate-600 hover:text-blue-600"
                                >
                                Catalogue
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                                font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                                <LogIn size={18} />
                                <span className="hidden sm:inline">
                                    Connexion
                                </span>
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2.5
                                text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:px-4"
                            >
                                <UserPlus size={18} />
                                <span>
                                    Inscription
                                </span>
                            </Link>
                        </div>
                </nav>
            </header>
            <main>
                <section id="accueil" className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                    <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden
                    rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-50 to-sky-100 p-6
                    sm:p-10 lg:grid-cols-2 lg:p-10">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border
                            border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700">
                                <BookOpen size={17} />
                                Votre bibliothèque numérique
                            </span>

                            <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight
                            text-slate-900 sm:text-5xl">
                                Découvrez votre prochaine {""}
                            <span className="text-blue-600">
                                lecture.
                            </span>
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                Explorez notre collection, découvrez de nouveaux auteurs et trouvez 
                                les livres qui vous inspirent.Votre prochaine aventure commence ici !
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link 
                                    to="/register"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600
                                    px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20
                                    transition hover:-translate-y-0.5 hover:bg-blue-700"
                                >
                                    Créer un compte
                                    <ArrowRight size={19} />
                                </Link>

                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300
                                    bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    <LogIn size={19}/>
                                    Seconnecter
                                </Link>
                            </div>

                            <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                                <BookMarked size={19} className="text-blue-600"/>
                                Découvrez les livres disponibles dans notre catalogue.
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-4 rounded-full bg-blue-200/50">
                            <img 
                                src="http://localhost:3000/uploads/bibliotheque-accueil.jpg"
                                 alt="Bibliothèque remplie de livres" 
                                 className="relative h-56 w-full rounded-2xl 
                                 object-cover  sm:h-80 lg:h-96"
                            />

                            <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-3
                            rounded-2xl bg-white p-3 shadow-lg sm:-bottom-4 sm:left-8 sm:p-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl
                                bg-emerald-100 text-emerald-700">
                                    <BookOpen size={23} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">
                                        Un monde à découvrir
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Un livre après l'autre
                                    </p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="catalogue"
                className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                A découvrir
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Quelques livres de notre collection
                            </h2>
                            <p className="mt-2 text-slate-500">
                                Trouvez votre prochaine lecture parmi nos livres.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Search size={18} />
                            <span>Notre sélection</span>
                        </div>
                    </div>

                    {loading ?(
                        <div className="flex judtify-center py-16 text-blue-600">
                            <LoaderCircle className="animate-spin" size={32} />
                            <span className="ml-3 text-slate-600">
                                Chargement des livres...
                            </span>
                        </div>
                    ):(
                        error ? (
                            <div
                                role="alert" 
                                className="rounded-2xl border border-amber-200 bg-amber-50
                                p-6 text-center text-amber-800">
                                    {error}
                            </div>
                        ): books.length === 0 ?(
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <BookOpen className="mx-auto text-slate-400" size={35} />
                                <p className="mt-3 font-semibold text-slate-700">
                                    Aucun livre à afficher pour le moment.
                                </p>
                            </div>
                        ):(
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 mg:grid-cols-6">
                                {books.map((book) => (
                                    <article
                                        key={book.id}
                                        className="group overflow-hidden rounded-2xl border
                                        border-slate-200 bg-white shadow-sm transition
                                        duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex h-36 items-center justify-center
                                        bg-grandient-to-br from-blue-100 to-indigo-100 sm:h-44">
                                           {book.cover_url ?(
                                                <img
                                                    src={`http://localhost:3000${book.cover_url}`}
                                                    alt={`Couverture de ${book.title}`}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                           ):(
                                             <BookOpen size={42}
                                                className="text-blue-400 transition group-hover:scale-110"
                                             />
                                           )}
                                        </div>

                                        <div className="p-3 sm:p-4">
                                            <h3 className="line-clamp-2 min-h-10 font-bold text-slate-800">
                                                {book.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                                                {book.author_first_name}
                                                {book.author_last_name}
                                            </p>
                                            <p className="mt-3">
                                                {Number(book.available_quantity)}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )
                    )}

                    <div className="mt-9 text-center">
                        <p>
                            Envie de découvrir notre bibliothèque ?
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600
                            px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Rejoindre la bibliothèque
                            <ArrowRight size={19} />
                        </Link>
                    </div>
                </section>


                <section className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-4 sm:grid-clos-3">
                        <div className="rounded-2xl bg-blue-50 p-5">
                            <BookOpen size={26}
                                className="text-blue-600"
                            />
                            <h3 className="mt-3 font-blod">
                                Explorez
                            </h3>
                            <p>
                                Découvrez les livres de notre collection.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-orange-50 p-5">
                            <LogIn scale={26} 
                            className="text-orange-600"/>
                            <h3 className="mt-3 font-bold">
                                Retrouvez vos livres
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Connectez-vous pour consulter vos emprunts
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 px-4 py-6 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Library Manager.Tous droits réservés.
            </footer>
        </div>
    )
};

export default Home;