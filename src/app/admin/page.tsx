import {getAllApplicationsAction} from '@/lib/actions/applications';
import {getCurrentUser} from '@/lib/actions/auth';
import {redirect} from 'next/navigation';
import AdminApplicationCard from '@/components/AdminApplicationCard';

export default async function AdminPanel() {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
        redirect('/login');
    }

    const applications = await getAllApplicationsAction();

    const pendingApplications = applications.filter(app => app.status === 'pending');
    const reviewedApplications = applications.filter(app => app.status !== 'pending');

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold dark:text-gray-100 text-gray-800 mb-2">
                    Панель администратора
                </h1>
                <p className="text-gray-600 dark:text-gray-200">
                    Добро пожаловать, {user.fullName}
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Новые заявки */}
                <div>
                    <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-700 mb-4 flex items-center">
                        🔔 Новые заявки
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                            {pendingApplications.length}
                        </span>
                    </h2>

                    {pendingApplications.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-2">✅</div>
                            <p className="text-gray-600">Нет новых заявок для рассмотрения</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingApplications.map((application) => (
                                <AdminApplicationCard
                                    key={application._id?.toString()}
                                    application={application}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Рассмотренные заявки */}
                <div>
                    <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-700 mb-4 flex items-center">
                        📋 Рассмотренные заявки
                        <span className="ml-2 bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
              {reviewedApplications.length}
            </span>
                    </h2>

                    {reviewedApplications.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-2">📄</div>
                            <p className="text-gray-600">Пока нет рассмотренных заявок</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {reviewedApplications.map((application) => (
                                <AdminApplicationCard
                                    key={application._id?.toString()}
                                    application={application}
                                    isReviewed
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Статистика */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                    <div className="text-sm text-gray-600">Всего заявок</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
                    <div className="text-sm text-gray-600">На рассмотрении</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'approved').length}
                    </div>
                    <div className="text-sm text-gray-600">Одобрено</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {applications.filter(app => app.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-gray-600">Отклонено</div>
                </div>
            </div>
        </div>
    );
}


