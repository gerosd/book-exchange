'use client'

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {createApplicationAction} from "@/lib/actions/applications";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";

export function ClientCreateApplication() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const defaultType = searchParams.get('type') as 'offer' | 'request' || 'offer';
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError('');
        setIsLoading(true);

        try {
            const result = await createApplicationAction(formData);
            if (result?.success && result?.redirectTo) {
                router.push(result.redirectTo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                    <Link
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                        ← Назад к заявкам
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Создать заявку
                    </h1>
                </div>

                {error && <ErrorMessage message={error}/>}

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Тип заявки *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center p-4 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="offer"
                                    defaultChecked={defaultType === 'offer'}
                                    className="mr-3"
                                    required
                                />
                                <div>
                                    <div className="font-medium text-gray-700">🎁 Предложить книгу</div>
                                    <div className="text-sm text-gray-700">У меня есть книга, которую я готов отдать
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center p-4 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="request"
                                    defaultChecked={defaultType === 'request'}
                                    className="mr-3"
                                    required
                                />
                                <div>
                                    <div className="font-medium text-gray-700">🔍 Найти книгу</div>
                                    <div className="text-sm text-gray-700">Я ищу определенную книгу</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Название книги *
                        </label>
                        <input
                            type="text"
                            id="bookTitle"
                            name="bookTitle"
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите название книги"
                        />
                    </div>

                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                            Автор *
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите имя автора"
                        />
                    </div>

                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                            Жанр *
                        </label>
                        <select
                            id="genre"
                            name="genre"
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Выберите жанр</option>
                            <option value="Художественная литература">Художественная литература</option>
                            <option value="Детектив">Детектив</option>
                            <option value="Фантастика">Фантастика</option>
                            <option value="Фэнтези">Фэнтези</option>
                            <option value="Романтика">Романтика</option>
                            <option value="Научная литература">Научная литература</option>
                            <option value="Бизнес">Бизнес</option>
                            <option value="Психология">Психология</option>
                            <option value="История">История</option>
                            <option value="Биография">Биография</option>
                            <option value="Детская литература">Детская литература</option>
                            <option value="Учебная литература">Учебная литература</option>
                            <option value="Другое">Другое</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                            Состояние книги *
                        </label>
                        <select
                            id="condition"
                            name="condition"
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Выберите состояние</option>
                            <option value="excellent">Отличное</option>
                            <option value="good">Хорошее</option>
                            <option value="fair">Удовлетворительное</option>
                            <option value="poor">Плохое</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Дополнительное описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Дополнительная информация о книге, особые пожелания или условия..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? 'Отправка...' : 'Отправить заявку'}
                        </button>

                        <Link
                            href="/dashboard"
                            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 text-center font-medium"
                        >
                            Отмена
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}