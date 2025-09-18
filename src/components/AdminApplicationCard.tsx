'use client';

import {useState} from 'react';
import {updateApplicationStatusAction, deleteApplicationAction} from '@/lib/actions/applications';
import {SerializedBookApplication} from '@/lib/types';
import FormattedPhone from './FormattedPhone';
import {useRouter} from "next/navigation";

interface AdminApplicationCardProps {
    application: SerializedBookApplication;
    isReviewed?: boolean;
}

export default function AdminApplicationCard({application, isReviewed = false}: AdminApplicationCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [comment, setComment] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const router = useRouter();

    const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
        if (!application._id) return;

        setIsProcessing(true);
        try {
            await updateApplicationStatusAction(
                application._id.toString(),
                status,
                comment || undefined
            );
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Ошибка при обновлении статуса заявки');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!application._id) return;

        if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
            return;
        }

        setIsProcessing(true);
        try {
            await deleteApplicationAction(application._id.toString());
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Ошибка при удалении заявки');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'На рассмотрении';
            case 'approved':
                return 'Одобрено';
            case 'rejected':
                return 'Отклонено';
            default:
                return status;
        }
    };

    const getTypeText = (type: string) => {
        return type === 'offer' ? 'Предложение' : 'Поиск';
    };

    const getConditionText = (condition: string) => {
        switch (condition) {
            case 'excellent':
                return 'Отличное';
            case 'good':
                return 'Хорошее';
            case 'fair':
                return 'Удовлетворительное';
            case 'poor':
                return 'Плохое';
            default:
                return condition;
        }
    };

    const handleActionClick = (action: 'approve' | 'reject') => {
        setActionType(action);
        setShowCommentInput(true);
    };

    const handleConfirmAction = () => {
        if (actionType) {
            // Convert 'approve' to 'approved' and 'reject' to 'rejected'
            const status = actionType === 'approve' ? 'approved' : 'rejected';
            handleStatusUpdate(status);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {application.bookTitle}
                        </h3>
                        <span className={getStatusBadge(application.status)}>
              {getStatusText(application.status)}
            </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Автор:</span> {application.author}</p>
                        <p><span className="font-medium">Жанр:</span> {application.genre}</p>
                        <p><span className="font-medium">Тип:</span> {getTypeText(application.type)}</p>
                        <p><span className="font-medium">Состояние:</span> {getConditionText(application.condition)}</p>
                    </div>

                    {application.description && (
                        <p className="text-gray-700 mb-3">
                            <span className="font-medium">Описание:</span> {application.description}
                        </p>
                    )}

                    <div className="bg-gray-50 p-3 rounded border">
                        <p className="font-medium text-gray-800 mb-1">Пользователь:</p>
                        <p className="text-sm text-gray-700">{application.user?.fullName}</p>
                        <p className="text-sm text-gray-600">
                            <FormattedPhone phone={application.user?.phone || ''}/>
                        </p>
                        <p className="text-sm text-gray-600">{application.user?.email}</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500 ml-4">
                    {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                </div>
            </div>

            {application.adminComment && (
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500 mb-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">Комментарий администратора:</p>
                    <p className="text-sm text-gray-700">{application.adminComment}</p>
                </div>
            )}

            {!isReviewed && !showCommentInput && (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleActionClick('approve')}
                        disabled={isProcessing}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                        ✅ Одобрить
                    </button>

                    <button
                        onClick={() => handleActionClick('reject')}
                        disabled={isProcessing}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                    >
                        ❌ Отклонить
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isProcessing}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                        🗑️ Удалить
                    </button>
                </div>
            )}

            {showCommentInput && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Комментарий (необязательно):
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                        rows={3}
                        placeholder="Добавьте комментарий для пользователя..."
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleConfirmAction}
                            disabled={isProcessing}
                            className={`px-4 py-2 rounded text-white text-sm disabled:opacity-50 ${
                                actionType === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isProcessing ? 'Обработка...' : `Подтвердить ${actionType === 'approve' ? 'одобрение' : 'отклонение'}`}
                        </button>

                        <button
                            onClick={() => {
                                setShowCommentInput(false);
                                setComment('');
                                setActionType(null);
                            }}
                            disabled={isProcessing}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {isReviewed && (
                <div className="flex justify-end">
                    <button
                        onClick={handleDelete}
                        disabled={isProcessing}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                        🗑️ Удалить
                    </button>
                </div>
            )}
        </div>
    );
}


