import {Collection} from 'mongodb';
import bcrypt from 'bcrypt';
import {connectToDatabase} from './connection';
import {User, CreateUserData} from '../types';

export async function getUsersCollection(): Promise<Collection<User>> {
    const {db} = await connectToDatabase();
    return db.collection<User>('users');
}

export async function createUser(userData: CreateUserData): Promise<User> {
    const collection = await getUsersCollection();

    // Проверяем уникальность логина
    const existingUser = await collection.findOne({login: userData.login});
    if (existingUser) {
        throw new Error('Пользователь с таким логином уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: Omit<User, '_id'> = {
        ...userData,
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await collection.insertOne(user);
    return {...user, _id: result.insertedId};
}

export async function findUserByLoginOrPhone(loginOrPhone: string): Promise<User | null> {
    const collection = await getUsersCollection();
    
    // Если строка содержит символы телефона, ищем по телефону
    if (loginOrPhone.includes('+') || loginOrPhone.includes('(') || loginOrPhone.includes('-')) {
        return await collection.findOne({phone: loginOrPhone});
    }
    
    // Иначе ищем по логину
    return await collection.findOne({login: loginOrPhone});
}

export async function validateUser(loginOrPhone: string, password: string): Promise<User | null> {
    const user = await findUserByLoginOrPhone(loginOrPhone);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
}

export async function createAdminUser(): Promise<void> {
    const collection = await getUsersCollection();

    const existingAdmin = await collection.findOne({login: 'admin'});
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser: Omit<User, '_id'> = {
        login: 'admin',
        password: hashedPassword,
        fullName: 'Администратор',
        phone: '+7(000)-000-00-00',
        email: 'admin@book-exchange.ru',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await collection.insertOne(adminUser);
}


