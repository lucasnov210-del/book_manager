import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {UserRound, Mail, LockKeyhole, ShieldCheck, UserPlus, LogIn,  Eye, EyeOff, LibraryBig} from "lucide-react";

function Register () {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword:""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setSuccess("");

        if(
            !formData.username.trim() ||
            !formData.email.trim() ||
            !formData.password
        ){
            setError("Veuillez remplir tous les champs.");
            return;
        }

        if(formData.password.length < 8){
            setError("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }

        if(formData.password !== formData.confirmPassword){
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try{
            setLoading(true);

            const response = await api.post("/auth/register", {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password:formData.password
            });

            setSuccess(response.data.message || "Inscription réussie !");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        }catch(err) {
            setError(
                err.response?.data?.message || "Une erreur est survenue lors de l'inscription"
            );

        }finally{
            setLoading(false);
        }
    };

    const inputClass = `w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4
    text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2
     focus:ring-blue-100`;

     return(
        <div className="flex min-h-screen items-center justify-center bg-grandient-to-br
        from-blue-50 via-slate-100 to-indigo-100 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border-white bg-white p-6 
            shadow-xl sm:p-8">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center
                    rounded-2xl bg-blue-600 text-white shadow-lg">
                        <LibraryBig size={32} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                        Créer un compte
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Rejoignez notre bibliothèque
                    </p>
                </div>

                {error &&(
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success &&(
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}
                <form onSubmit={handleSubmit}
                className="space-y-5">
                    <div>
                        <label htmlFor="username"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Nom d'utilisateur:
                        </label>

                        <div className="relative">
                            <UserRound size={19} className="absolute left-3 top-1/2 -translate-y-1/2
                             text-slate-400" />
                        
                        <input 
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            className={inputClass}
                         />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Adresse e-mail:
                        </label>

                           <div className="relative">
                            <Mail size={19} className="absolute left-3 top-1/2 -translate-y-1/2
                             text-slate-400" />
                        
                        <input 
                            type="email"
                             name="email"
                              id="email"
                              autoComplete="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              maxLength={150}
                              className={inputClass}
                         />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Mot de passe:
                        </label>

                           <div className="relative">
                            <LockKeyhole size={19} className="absolute left-3 top-1/2 -translate-y-1/2
                             text-slate-400" />
                        
                        <input 
                            type={showPassword ? "text": "password"}
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className={`${inputClass}pr-12`}
                         />

                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500
                            hover:text-blue-600"
                         >
                            {showPassword ? <EyeOff size={19} />
                            : <Eye size={19} />}
                         </button>
                        </div>
                    </div>

                      <div>
                        <label htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Confirmé le mot de passe:
                        </label>

                           <div className="relative">
                            <ShieldCheck size={19} className="absolute left-3 top-1/2 -translate-y-1/2
                             text-slate-400" />
                        
                        <input 
                            type={showConfirmPassword ? "text": "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className={`${inputClass}pr-12`}
                         />

                         <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500
                            hover:text-blue-600"
                         >
                            {showConfirmPassword ? <EyeOff size={19} />
                            : <Eye size={19} />}
                         </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl
                        bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-md transition
                        hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200
                        disabled:opacity-60"
                    >
                        <UserPlus size={20} />
                        {loading ? "Inscription en cours..."
                        : "S-inscrire"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200"/>
                    <span className="text-xs text-slate-800">
                            Déjà un compte?
                    </span>
                    <div className="h-px flex-1 bg-slate-200"/>

                    <Link
                        to="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-xl
                        border border-slate-300 px-4 py-3 font-semibold text-slate-700
                        transition hover:border-blue-300 hover:bg-blue-50
                        hover:text-blue-700"
                    >
                            <LogIn size={19} />
                            Se connecter
                    </Link>

                    <p className="mt-6 text-center text-xs text-slate-800">
                        Library Manager .Votre bibliothèque numérique
                    </p>
                </div>
            </div>
        </div>
     );
       
};

export default Register;