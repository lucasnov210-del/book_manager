import api from "../services/api";
import {Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {Mail, UserPlus, Lock, LogIn, Eye, EyeOff} from "lucide-react";

function Login({onLogin}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading]= useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => 
    {
        e.preventDefault();

        setError("");
        setLoading(true);

        try{
            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);

            const userResponse = await api.get("/auth/me");

            const userData = userResponse.data.user;

            onLogin(userData)

            if(userData.role === "admin"){
                navigate("/admin");

            }else if(userData.role === "librarian"){
                navigate("/librarian");

            }else if(userData.role === "user"){
                navigate("/reader");

            }else{
                navigate("/login");
            }

        }catch(error){
            setError(error.response?.data?.message) || "Erreur de connexion";

        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-blue-100 p-4">
                            <LogIn className= "text-blue-600" size={28} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Library Manager
                    </h1>
                    <p className="mt-2">
                        Connectez-vous à votre compte
                    </p>
                </div>

                <form  onSubmit = {handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
                        <Mail className="text-slate-400" size={20} />
                        <input type="email"
                        value={email}
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                         className="w-full outline-none" />
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
                        <Lock className="text-slate-400" size={20} />
                        <input type={showPassword ? "text": "password"}
                        value={password}
                        placeholder="Mot de passe..." 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full outline-none" />

                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover: text-slate-600"
                        >
                            {showPassword ? <EyeOff size={20} />
                                : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <button
                     type="submit"
                     disabled= {loading}
                     className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600
                     py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed
                     disabled:opacity-50"
                     >
                            <LogIn size={20} />
                            {loading ? "Connexion" : "Se connecter"}
                    </button>
                </form>
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200"/>
                    <span className="text-xs text-slate-800">
                            Pas un compte?
                    </span>
                    <div className="h-px flex-1 bg-slate-200"/>

                    <Link
                        to="/register"
                        className="flex w-full items-center justify-center gap-2 rounded-xl
                        border border-slate-300 px-4 py-3 font-semibold text-slate-700
                        transition hover:border-green-300 hover:bg-green-50
                        hover:text-green-700"
                    >
                            <UserPlus size={19} />
                            S'inscrire
                    </Link>

                    <p className="mt-6 text-center text-xs text-slate-800">
                        Library Manager .Votre bibliothèque numérique
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;