'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {loginAction} from '@/lib/actions/auth';
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import PhoneInput from '@/components/PhoneInput';

export default function LoginForm() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState<'login' | 'phone'>('login');
    const [phoneValue, setPhoneValue] = useState('');
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError('');
        setIsLoading(true);

        try {
            const result = await loginAction(formData);
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
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Вход в систему</h1>

            {success === 'registration' && (
                <SuccessMessage message="Регистрация прошла успешно! Теперь вы можете войти в систему."/>
            )}

            {error && <ErrorMessage message={error}/>}

            {/* Переключатель типа входа */}
            <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => setLoginType('login')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                            loginType === 'login'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        По логину
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType('phone')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                            loginType === 'phone'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        По телефону
                    </button>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-4">
                {loginType === 'login' ? (
                    <div>
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                            Логин
                        </label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите логин"
                        />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Телефон
                        </label>
                        <PhoneInput
                            id="phone"
                            name="login"
                            value={phoneValue}
                            onChange={setPhoneValue}
                            required
                            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+7(XXX)-XXX-XX-XX"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Введите номер телефона, который указали при регистрации
                        </p>
                    </div>
                )}

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите пароль"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                    Нет аккаунта?{' '}
                    <Link href="/register" className="text-blue-600 hover:text-blue-800">
                        Зарегистрироваться
                    </Link>
                </p>

                <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-gray-500 mb-2">Вход для администратора:</p>
                    <p className="text-xs text-gray-400">
                        Логин: <span className="font-mono">admin</span><br/>
                        Пароль: <span className="font-mono">admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
