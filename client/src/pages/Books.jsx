import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Books() {

    const navigate = useNavigate();

    const [editingBook, setEditingBook] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title:"",
        isbn:"",
        publication_year:"",
        quantity:"",
        author_id:"",
        category_id:""
    });

    const [books, setBooks] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData]= useState({
        title:"",
        publication_year:"",
        quantity:"",
        author_id:"",
        category_id:""

    });

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const handleCreateBook = async (e) => {
        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        try{
             await api.post("/books",{
                title: formData.title,
                publication_year: formData.publication_year
                    ? Number(formData.publication_year)
                    : null,
                quantity: Number(formData.quantity),
                author_id: Number(formData.author_id),
                category_id: Number(formData.category_id)

            });

            setMessage("Livre créé avec succès!");

            setFormData({
                title:"",
                publication_year:"",
                quantity:"",
                author_id:"",
                category_id:""
            });

            setShowForm(false);

            const booksResponse = await api.get("/books");

            setBooks(booksResponse.data.books);

        }catch(error){

            console.error("Erreur lors de la création du livre :",
                 error.response?.data || error.message);

            setErrorMessage(
                error.response?.data?.message || "impossible de créer le livre"
            );
        }
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        try{
            await api.put(`/books/${editingBook.id}`, {
                title: editFormData.title,
                publication_year: editFormData.publication_year
                    ? Number(editFormData.publication_year)
                    : null,
                quantity: Number(editFormData.quantity),
                author_id: Number(editFormData.author_id),
                category_id: Number(editFormData.category_id)
            });

            setMessage("Livre modifié avec succès!");

            setEditingBook(null);

            const booksResponse = await api.get("/books");

            setBooks(booksResponse.data.books);

        }catch(error){
            console.error("Erreur lors de la modification du livre:", 
                error.response?.data || error.message
            );

            setErrorMessage(
                error.response?.data?.message || 
                "Impossible de modifier le livre"
            );
        }
    };

    const handleDeleteBook = async (id) => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer ce livre?");

        if(!confirmed) return;

        try{
            await api.delete(`/books/${id}`);

            setBooks((previousBooks) => previousBooks.filter(
                (book) => book.id !== id
            ));

            setMessage("Livre supprimé avec succès!");
            setErrorMessage("");

        }catch(error){
            console.error("Erreur lors de la suppression:",
                error.response?.data || error.message
            );

            setErrorMessage(
                error.response?.data?.message ||
                    "Impossible de supprimer ce livre"
            );
        }
    };

    const handleEditClick = (book) => {
        setEditingBook(book);

        setEditFormData({
            title: book.title || "",
            publication_year: book.publication_year || "",
            quantity: book.quantity ?? "",
            author_id: book.author_id ?? "",
            category_id: book.category_id ?? ""
        });

        setMessage("");
        setErrorMessage("");
    }

    useEffect(() => {
        const fetchBooks = async () => {
            try{
                const response=  await api.get("/books");

                setBooks(response.data.books);

            }catch(error){
                console.error("Erreur lors de la récupération des livres:", error);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        const fetchFormData = async () => {
            try{
                const [authorsResponse, categoriesResponse] = await Promise.all([
                    api.get("/authors"),
                    api.get("/categories")
                ]);

                setAuthors(authorsResponse.data.authors);

                setCategories(categoriesResponse.data.categories);

            }catch(error){
                console.error("Erreur lors du chargement des auteurs et catégories:", 
                    error.response?.data || error.message
                );
            }
        };

        fetchFormData();
    }, []);
    
    return(
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-slate-800">
                    Gestion des livres
                </h1>
                <p className="mt-2">
                    Liste des livres de la bibliothèque
                </p>

                <div className="mt-6">
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setMessage("");
                            setErrorMessage("");
                        }}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white
                        transition hover:bg-blue-700"
                    >
                        {showForm? "Annuler" : "Ajouter un livre"}

                        {message && (
                            <p className="mt-4 text-green-600">
                                {message}
                            </p>
                        )}

                        {errorMessage && (
                            <p className="mt-4 text-red-600">
                                {errorMessage}
                            </p>
                        )}

                    </button>

                     {showForm && (
                            <form
                                onSubmit={handleCreateBook}
                                className="mt-5 grid gap-4 rounded-2xl bg-white p-6 shadow sm:grid-cols-2"
                            >
                                <input 
                                    type="text"
                                    placeholder="Titre du livre..."
                                     value={formData.title}
                                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                                      required
                                      className="rounded-xl border border-slate-300 p-3" 
                                />

                                <input
                                    type="number"
                                    placeholder="Année de publication..."
                                     value={formData.publication_year}
                                     onChange={(e) => setFormData({...formData, publication_year: e.target.value})}
                                      required
                                      className="rounded-xl border border-slate-300 p-3"
                                 />

                                   <input
                                    type="number"
                                    placeholder="Quantité..."
                                     value={formData.quantity}
                                     min="1"
                                     onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                      required
                                      className="rounded-xl border border-slate-300 p-3"
                                 />

                                 <div>
                                    <label className="mb-1 block font-medium">
                                        Auteur:
                                    </label>
                                    <select 
                                        value={formData.author_id}
                                        onChange={(e) => setFormData(
                                            {...formData, author_id:e.target.value}
                                        )}
                                        required
                                        className="w-full rounded-xl border border-gray-300 p-3"
                                    >
                                        <option value="">
                                            Choisir un auteur
                                        </option>
                                        {authors.map((author) => (
                                            <option
                                                key={author.id}
                                                value={author.id}
                                            >
                                                {author.first_name} {author.last_name}
                                            </option>
                                        ))}
                                    </select>
                                 </div>

                                  <div>
                                    <label className="mb-1 block font-medium">
                                        Categorie:
                                    </label>
                                    <select 
                                        value={formData.category_id}
                                        onChange={(e) => setFormData(
                                            {...formData, category_id:e.target.value}
                                        )}
                                        required
                                        className="w-full rounded-xl border border-gray-300 p-3"
                                    >
                                        <option value="">
                                            Choisir une catégorie
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                 </div>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-emerald-600 py-3 font-semibold 
                                    text-white transition hover: bg-emerald-700 sm:col-span-2"
                                >
                                    Enregistrer le livre
                                </button>

                            </form>
                        )}

                         {editingBook &&(
                    <form
                        onSubmit={handleUpdateBook}
                        className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow sm:grid-cols-2"
                    >
                        <h2 className="text-xl font-bold sm:col-span-2">
                            Modifier: {editingBook.title}
                        </h2>

                        <input 
                            type="text"
                            placeholder="Titre du livre"
                            value={editFormData.title}
                            onChange={(e) =>
                                setEditFormData({...editFormData, title: e.target.value})
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 p-3"
                         />

                         <input 
                            type="number"
                            placeholder="Année de publication"
                            value={editFormData.publication_year}
                            onChange={(e) => 
                                setEditFormData({...editFormData, publication_year: e.target.value})
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 p-3"
                              
                         />

                         <input 
                            type="number"
                            min="1"
                            placeholder="Quantité"
                            value={editFormData.quantity}
                            onChange={(e) =>
                                setEditFormData({...editFormData, quantity: e.target.value})
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 p-3"
                          />

                          <select
                            value={editFormData.author_id}
                            onChange={(e) => 
                                setEditFormData({...editFormData, author_id: e.target.value})
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 p-3"
                          >
                            <option value="">Choisir un auteur</option>
                            {authors.map((author) => (
                                <option
                                    key={author.id}
                                    value={author.id}
                                >
                                    {author.first_name} {author.last_name}
                                </option>
                            ))}
                          </select>

                          <select
                            value={editFormData.category_id}
                            onChange={(e) => 
                                setEditFormData({...editFormData, category_id: e.target.value})
                            }
                            required
                            className="w-full rounded-xl border border-gray-300 p-3"
                          >
                            <option value="">Choisir une catégorie</option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                          </select>

                          <button 
                            type="submit"
                            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold
                            text-white hover:bg-blue-700"
                          >
                            Enregistrer les modifications
                          </button>

                          <button 
                            type="button"
                            onClick={() => setEditingBook(null)}
                            className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800
                            hover:bg-gray-300"
                          >
                            Annuler
                          </button>
                    </form>
                )}
                        
                </div>
                <div className="mt-8 rounded-2xl bg-white p-6 shadow">
                    {books.length > 0 ?(
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {books.map((book) => {

                                return(
                                      <div key={book.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-800">
                                Titre: {book.title}
                                </h2>
                                <p className="mt-1 text-slate-600">
                                    Auteur: {book.author_first_name} {book.author_last_name}
                                </p>
                                
                                <p className="mt-1 text-slate-500">
                                    Catégorie: {book.category}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Année: {book.publication_year}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    ISBN: {book.isbn}
                                </p>
                                <p className="mt-2 text-slate-500">
                                    Quantité: {book.quantity}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Disponible: {book.available_quantity}
                                </p>
                                <button 
                                    onClick={() => navigate(`/books/${book.id}`)}
                                    className="mt-5 w-full rounded-xl bg-slate-800 px-4 py-3
                                    font-semibold hover:bg-slate-700"
                                >
                                    Voir les détails
                                </button>

                                 <button
                                    type="button"
                                    onClick={() => handleEditClick(book)}
                                    className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-3
                                    font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Modifier
                                </button>

                                <button
                                    onClick={() => handleDeleteBook(book.id)}
                                    className="mt-2 w-full rounded-xl bg-red-600 px-4 py-3
                                    font-semibold text-white transition hover:bg-red-700"
                                >
                                    Supprimer
                                </button>
                                </div>
                                )
                            }
                              
                            )}
                        </div>
                    ): (
                        <p>
                            Livre indisponible pour le moment.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Books;