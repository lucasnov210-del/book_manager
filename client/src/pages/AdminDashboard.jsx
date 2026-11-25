import { useState } from "react";
import {LayoutDashboard, BookOpen, Bookmark, Users, LogOut, Menu, X} from "lucide-react";

const Dashboard = () => {

    {/*état */}
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Tableau de bord');

    //Config. des éléments du menu
    const menuItems = [
        {name:'Tableau de bord', icon: LayoutDashboard},
        {name:'Livres', icon: BookOpen},
        {name:'Utilisateurs', icon:Users},
        {name:'Emprunts', icon:Bookmark}
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return(
        <>
            {/*Version mobile */}
            <div className="bg-slate-900 text-white flex justify-between items-center p-4
            md:hidden fixed top-0 left-0 right-0 z-50 shadow-md">
                <span className="text-xl font-bold tracking-wider">BiblioGestion</span>

                <button
                    onClick={toggleMenu} 
                    className="p-2 focus:outline-none hover:bg-slate-800 rounded 
                    transition-colors"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/*Barre de nav verticale */}
            <aside className={`fixed top-0 bottom-0 left-0 z-40
                w-64 bg-slate-900 text-slate-100
                flex flex-col justify-between
                p-4 border-r border-slate-800
                transition-transform duration-300 ease-in-out pt-20 md:pt-4
                ${isOpen ? 'translate-x-0': '-translate-x-full'} md:translate-x-0`}
            >
                {/*Section Haute: Logo + liens */}
                <div className="flex flex-col gap-8">
                    <div className="hidden md:block px-4 py-2">
                        <h1 className="text-2xl font-bold tracking-wider text-white">
                            BiblioGestion
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.name;

                            return(
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActiveItem(item.name);
                                        setIsOpen(false)//fermer automatique le lien après clique
                                    }}
                                    className={`
                                        flex items-center gap-4 px-4 py-3 rounded-lg font-medium
                                        text-sm transition-all duration-200 group w-full text-left
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            :'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-white': 'text-slate-400 group-hover:text-slate-100'} />
                                    <span>{item.name}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className="border-t border-slate-800 pt-4">
                    <button
                        onClick={() => console.log('Disconnect...')}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg font-medium
                        text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all
                        duration-200 w-full text-left"
                    >
                        <LogOut size={20} />
                        <span>Déconnextion</span>
                    </button>
                </div>
            </aside>

            {/*Arrière-plan sombre */}
            {isOpen &&(
                <div
                    onClick={toggleMenu}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                >

                </div>
            )}
        </>
    );
};

export default Dashboard;