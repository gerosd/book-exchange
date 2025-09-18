'use server';

import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {createUser, validateUser, createAdminUser} from '../mongo/users';
import {CreateUserData, LoginData} from '../types';

// Инициализация администратора при старте
createAdminUser().catch(console.error);

export async function registerAction(formData: FormData) {
    const userData: CreateUserData = {
        login: formData.get('login') as string,
        password: formData.get('password') as string,
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
    };

    // Валидация
    if (!userData.login || userData.login.length < 6) {
        throw new Error('Логин должен содержать минимум 6 символов');
    }

    if (!/^[a-zA-Z]+$/.test(userData.login)) {
        throw new Error('Логин должен содержать только символы латиницы');
    }

    if (!userData.password || userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }

    if (!/^[а-яёА-ЯЁ\s]+$/.test(userData.fullName)) {
        throw new Error('ФИО должно содержать только символы кириллицы и пробелы');
    }

    if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(userData.phone)) {
        throw new Error('Телефон должен быть в формате +7(XXX)-XXX-XX-XX');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Некорректный формат электронной почты');
    }

    try {
        await createUser(userData);
        return { success: true, redirectTo: '/login?success=registration' };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Ошибка регистрации');
    }
}

export async function loginAction(formData: FormData) {
    const loginData: LoginData = {
        login: formData.get('login') as string,
        password: formData.get('password') as string,
    };

    if (!loginData.login || !loginData.password) {
        throw new Error('Заполните все поля');
    }

    try {
        const user = await validateUser(loginData.login, loginData.password);
        if (!user) {
            throw new Error('Неверный логин/телефон или пароль');
        }

        // Создаем сессию
        const cookieStore = await cookies();
        cookieStore.set('user-session', JSON.stringify({
            id: user._id,
            login: user.login,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        });

        const redirectTo = user.isAdmin ? '/admin' : '/dashboard';
        return { success: true, redirectTo };
    } catch (error) {
        if (error instanceof Error && error.message === 'Неверный логин/телефон или пароль') {
            throw error;
        }
        throw new Error(error instanceof Error ? error.message : 'Ошибка входа');
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('user-session');
    redirect('/');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');

    if (!sessionCookie) return null;

    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}


