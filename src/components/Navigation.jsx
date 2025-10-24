import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';

function Navigation() {
    const { isAuthenticated, logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-indigo-600 dark:bg-gray-800 shadow-lg transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <Link to="/login" className="flex items-center space-x-2 sm:space-x-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-base sm:text-xl font-bold text-white">Trang User</span>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                            title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {isAuthenticated && (
                            <>
                                <Link to="/deposit" className="px-3 lg:px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Nạp
                                </Link>
                                <Link to="/change-account-info" className="px-3 lg:px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="hidden lg:inline">Tài khoản</span>
                                    <span className="lg:hidden">TK</span>
                                </Link>
                                <Link to="/renew-account" className="px-3 lg:px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden lg:inline">Gia hạn</span>
                                    <span className="lg:hidden">GH</span>
                                </Link>
                                <button 
                                    onClick={logout}
                                    className="ml-1 lg:ml-2 px-3 lg:px-5 py-2 bg-white dark:bg-gray-700 text-indigo-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition font-semibold shadow-md text-sm"
                                >
                                    <span className="hidden lg:inline">Đăng xuất</span>
                                    <span className="lg:hidden">Thoát</span>
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium text-sm">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="px-4 lg:px-5 py-2 bg-white dark:bg-gray-700 text-indigo-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition font-semibold shadow-md text-sm">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-white/20">
                        {isAuthenticated ? (
                            <div className="space-y-2">
                                <Link 
                                    to="/deposit" 
                                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    💰 Nạp tiền
                                </Link>
                                <Link 
                                    to="/change-account-info" 
                                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    👤 Thông tin tài khoản
                                </Link>
                                <Link 
                                    to="/renew-account" 
                                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ⏰ Gia hạn tài khoản
                                </Link>
                                <button 
                                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium"
                                >
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link 
                                    to="/login" 
                                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="block px-4 py-2 bg-white dark:bg-gray-700 text-indigo-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
