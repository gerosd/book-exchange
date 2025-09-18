import {ObjectId} from 'mongodb';

export interface User {
    _id?: ObjectId;
    login: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookApplication {
    _id?: ObjectId | string;
    userId: ObjectId | string;
    user?: User | SerializedUser;
    bookTitle: string;
    author: string;
    genre: string;
    description: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    type: 'offer' | 'request'; // предлагает или ищет книгу
    status: 'pending' | 'approved' | 'rejected';
    adminComment?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface SerializedUser {
    _id: string;
    login: string;
    fullName: string;
    phone: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SerializedBookApplication {
    _id: string;
    userId: string;
    user?: SerializedUser;
    bookTitle: string;
    author: string;
    genre: string;
    description: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    type: 'offer' | 'request';
    status: 'pending' | 'approved' | 'rejected';
    adminComment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserData {
    login: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
}

export interface LoginData {
    login: string;
    password: string;
}

export interface CreateApplicationData {
    bookTitle: string;
    author: string;
    genre: string;
    description: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    type: 'offer' | 'request';
}


