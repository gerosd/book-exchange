'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import {registerAction} from "@/lib/actions/auth";
import ErrorMessage from "@/components/ErrorMessage";
import PhoneInput from "@/components/PhoneInput";
import Link from "next/link";

export function RegisterForm() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phoneValue, setPhoneValue] = useState('');
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError('');
        setIsLoading(true);

        try {
            const result = await registerAction(formData);
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Регистрация</h1>

            {error && <ErrorMessage message={error}/>}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                        Логин *
                    </label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Минимум 6 символов"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль *
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Минимум 6 символов"
                    />
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        pattern="[а-яёА-ЯЁ\s]+"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Иванов Иван Иванович"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон *
                    </label>
                    <PhoneInput
                        id="phone"
                        name="phone"
                        value={phoneValue}
                        onChange={setPhoneValue}
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+7(XXX)-XXX-XX-XX"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                    Войти
                </Link>
            </p>
        </div>
    );
}