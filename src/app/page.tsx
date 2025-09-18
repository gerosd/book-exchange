import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    📚 Система обмена книгами
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Найдите новые книги или поделитесь своими с другими читателями
                </p>
                
                {!user && (
                    <div className="space-x-4">
                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                            Зарегистрироваться
                        </Link>
                        <Link
                            href="/login"
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
                        >
                            Войти
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        🎁 Предложить книгу
                    </h2>
                    <p className="text-gray-600 mb-4">
                        У вас есть книги, которые вы готовы передать другим читателям? 
                        Создайте заявку и найдите для них новых хозяев.
                    </p>
                    {user && (
                        <Link
                            href="/create-application?type=offer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Предложить книгу →
                        </Link>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        🔍 Найти книгу
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Ищете определенную книгу? Создайте заявку с описанием того, 
                        что вас интересует, и другие пользователи смогут вам помочь.
                    </p>
                    {user && (
                        <Link
                            href="/create-application?type=request"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Найти книгу →
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Как это работает?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl mb-4">1️⃣</div>
                        <h3 className="font-semibold mb-2 text-gray-700">Регистрация</h3>
                        <p className="text-gray-600 text-sm text-gray-700">
                            Создайте аккаунт, указав свои контактные данные
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-3xl mb-4">2️⃣</div>
                        <h3 className="font-semibold mb-2 text-gray-700">Создание заявки</h3>
                        <p className="text-gray-600 text-sm text-gray-700">
                            Опишите книгу, которую хотите отдать или получить
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-3xl mb-4">3️⃣</div>
                        <h3 className="font-semibold mb-2 text-gray-700">Модерация</h3>
                        <p className="text-gray-600 text-sm text-gray-700">
                            Администратор проверит заявку и свяжется с вами
                        </p>
                    </div>
                </div>
            </div>

            {user && (
                <div className="mt-8 text-center">
                    <Link
                        href={user.isAdmin ? "/admin" : "/dashboard"}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                    >
                        {user.isAdmin ? "Панель администратора" : "Мои заявки"}
                    </Link>
                </div>
            )}
        </div>
    );
}