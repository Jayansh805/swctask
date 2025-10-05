import React, { use, useState } from 'react';
import { Home, ShoppingBag, MessageSquare, User, LogOut, Menu, X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

function Navbar(props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const tkn = localStorage.getItem("token");

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="flex items-center hover:opacity-80 transition-opacity"
                        >
                            <ShoppingBag className="mr-2 text-blue-600" size={24} />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Sasta OLX
                            </h1>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {props.isAuth ? (
                            <>
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <User className="mr-1" size={18} />
                                    {props.username}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                                >
                                    <LogOut className="mr-1" size={18} />
                                    Logout
                                </button>
                            </>) : (
                            <>
                                <button
                                    onClick={() => handleNavigation('/signup')}
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <User className="mr-1" size={18} />
                                    Signup
                                </button>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <LogIn className="mr-1" size={18} />
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 p-2"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                            {props.isAuth ? (
                                <>
                                    <button
                                        onClick={() => handleNavigation('/profile')}
                                        className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                    >
                                        <User className="mr-2" size={18} />
                                        {user.username}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                    >
                                        <LogOut className="mr-2" size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleNavigation('/signup')}
                                        className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                    >
                                        <User className="mr-2" size={18} />
                                        Signup
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('/login')}
                                        className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                    >
                                        <LogIn className="mr-2" size={18} />
                                        Login
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;