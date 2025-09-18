'use server';

import {redirect} from 'next/navigation';
import {ObjectId} from 'mongodb';
import {
    createApplication,
    getUserApplications,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication
} from '../mongo/applications';
import {CreateApplicationData, SerializedBookApplication} from '../types';
import {getCurrentUser} from './auth';

export async function createApplicationAction(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

    const applicationData: CreateApplicationData = {
        bookTitle: formData.get('bookTitle') as string,
        author: formData.get('author') as string,
        genre: formData.get('genre') as string,
        description: formData.get('description') as string,
        condition: formData.get('condition') as 'excellent' | 'good' | 'fair' | 'poor',
        type: formData.get('type') as 'offer' | 'request',
    };

    // Валидация
    if (!applicationData.bookTitle || !applicationData.author || !applicationData.genre) {
        throw new Error('Заполните все обязательные поля');
    }

    try {
        await createApplication(new ObjectId(user.id), applicationData);
        return {success: true, redirectTo: '/dashboard?success=application'};
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Ошибка создания заявки');
    }
}

export async function getUserApplicationsAction(): Promise<SerializedBookApplication[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        const applications = await getUserApplications(new ObjectId(user.id));
        // Сериализуем данные для передачи в Client Component
        return applications.map(app => ({
            _id: app._id?.toString() || '',
            userId: app.userId?.toString() || '',
            bookTitle: app.bookTitle,
            author: app.author,
            genre: app.genre,
            description: app.description,
            condition: app.condition,
            type: app.type,
            status: app.status,
            adminComment: app.adminComment,
            createdAt: typeof app.createdAt === 'string' ? app.createdAt : app.createdAt?.toISOString() || '',
            updatedAt: typeof app.updatedAt === 'string' ? app.updatedAt : app.updatedAt?.toISOString() || '',
        }));
    } catch (error) {
        console.error('Error fetching user applications:', error);
        return [];
    }
}

export async function getAllApplicationsAction(): Promise<SerializedBookApplication[]> {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
        redirect('/login');
    }

    try {
        const applications = await getAllApplications();
        // Сериализуем данные для передачи в Client Component
        return applications.map(app => ({
            _id: app._id?.toString() || '',
            userId: app.userId?.toString() || '',
            bookTitle: app.bookTitle,
            author: app.author,
            genre: app.genre,
            description: app.description,
            condition: app.condition,
            type: app.type,
            status: app.status,
            adminComment: app.adminComment,
            createdAt: typeof app.createdAt === 'string' ? app.createdAt : app.createdAt?.toISOString() || '',
            updatedAt: typeof app.updatedAt === 'string' ? app.updatedAt : app.updatedAt?.toISOString() || '',
            user: app.user ? {
                _id: app.user._id?.toString() || '',
                login: app.user.login,
                fullName: app.user.fullName,
                phone: app.user.phone,
                email: app.user.email,
                isAdmin: app.user.isAdmin,
                createdAt: typeof app.user.createdAt === 'string' ? app.user.createdAt : app.user.createdAt?.toISOString() || '',
                updatedAt: typeof app.user.updatedAt === 'string' ? app.user.updatedAt : app.user.updatedAt?.toISOString() || '',
            } : undefined
        }));
    } catch (error) {
        console.error('Error fetching all applications:', error);
        return [];
    }
}

export async function updateApplicationStatusAction(
    applicationId: string,
    status: 'approved' | 'rejected',
    adminComment?: string
) {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
        throw new Error('Доступ запрещен');
    }

    try {
        await updateApplicationStatus(new ObjectId(applicationId), status, adminComment);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Ошибка обновления заявки');
    }
}

export async function deleteApplicationAction(applicationId: string) {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
        throw new Error('Доступ запрещен');
    }

    try {
        await deleteApplication(new ObjectId(applicationId));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Ошибка удаления заявки');
    }
}


