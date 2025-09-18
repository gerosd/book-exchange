import Link from 'next/link';
import {getUserApplicationsAction} from '@/lib/actions/applications';
import {getCurrentUser} from '@/lib/actions/auth';
import {redirect} from 'next/navigation';
import SuccessMessage from '@/components/SuccessMessage';

interface PageProps {
    searchParams: Promise<{ success?: string }>;
}

export default async function Dashboard({searchParams}: PageProps) {
    const user = await getCurrentUser();
    const resolvedSearchParams = await searchParams;

    if (!user) {
        redirect('/login');
    }

    const applications = await getUserApplicationsAction();

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

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Мои заявки
                </h1>
                <Link
                    href="/create-application"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Создать заявку
                </Link>
            </div>

            {resolvedSearchParams.success === 'application' && (
                <SuccessMessage message="Заявка успешно создана и отправлена на рассмотрение!"/>
            )}

            {applications.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        У вас пока нет заявок
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Создайте свою первую заявку, чтобы найти или предложить книгу
                    </p>
                    <Link
                        href="/create-application"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                        Создать заявку
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((application) => (
                        <div key={application._id?.toString()} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {application.bookTitle}
                                        </h3>
                                        <span className={getStatusBadge(application.status)}>
                      {getStatusText(application.status)}
                    </span>
                                    </div>
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Автор:</span> {application.author}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Жанр:</span> {application.genre}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Тип:</span> {getTypeText(application.type)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span
                                            className="font-medium">Состояние:</span> {getConditionText(application.condition)}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                                    {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                                </div>
                            </div>

                            {application.description && (
                                <div className="mb-4">
                                    <p className="text-gray-700">
                                        <span className="font-medium">Описание:</span> {application.description}
                                    </p>
                                </div>
                            )}

                            {application.adminComment && (
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                    <p className="text-sm font-medium text-gray-800 mb-1">Комментарий
                                        администратора:</p>
                                    <p className="text-sm text-gray-700">{application.adminComment}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


