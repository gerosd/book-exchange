'use client';

import Link from 'next/link';
import {useState} from 'react';
import {logoutAction} from '@/lib/actions/auth';

interface NavigationProps {
    user?: {
        id: string;
        login: string;
        fullName: string;
        isAdmin: boolean;
    } | null;
}

export default function Navigation({user}: NavigationProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logoutAction();
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold">
                        📚 Обмен книгами
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm">Добро пожаловать, {user.fullName}</span>
                                {user.isAdmin ? (
                                    <Link href="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                                        Панель администратора
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                                            Мои заявки
                                        </Link>
                                        <Link href="/create-application"
                                              className="hover:bg-blue-700 px-3 py-2 rounded">
                                            Создать заявку
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="hover:bg-blue-700 px-3 py-2 rounded cursor-pointer"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Войти
                                </Link>
                                <Link href="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white"
                    >
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {user ? (
                                <>
                                    <div className="text-sm text-blue-200 px-3 py-2">
                                        Добро пожаловать, {user.fullName}
                                    </div>
                                    {user.isAdmin ? (
                                        <Link
                                            href="/admin"
                                            className="block hover:bg-blue-700 px-3 py-2 rounded"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Панель администратора
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block hover:bg-blue-700 px-3 py-2 rounded"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Мои заявки
                                            </Link>
                                            <Link
                                                href="/create-application"
                                                className="block hover:bg-blue-700 px-3 py-2 rounded"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Создать заявку
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded cursor-pointer"
                                    >
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block hover:bg-blue-700 px-3 py-2 rounded"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Войти
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block hover:bg-blue-700 px-3 py-2 rounded"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Регистрация
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}


