import {Collection, ObjectId} from 'mongodb';
import {connectToDatabase} from './connection';
import {BookApplication, CreateApplicationData} from '../types';

export async function getApplicationsCollection(): Promise<Collection<BookApplication>> {
    const {db} = await connectToDatabase();
    return db.collection<BookApplication>('applications');
}

export async function createApplication(
    userId: ObjectId,
    applicationData: CreateApplicationData
): Promise<BookApplication> {
    const collection = await getApplicationsCollection();

    const application: Omit<BookApplication, '_id'> = {
        userId,
        ...applicationData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await collection.insertOne(application);
    return {...application, _id: result.insertedId};
}

export async function getUserApplications(userId: ObjectId): Promise<BookApplication[]> {
    const collection = await getApplicationsCollection();
    return await collection.find({userId}).sort({createdAt: -1}).toArray();
}

export async function getAllApplications(): Promise<BookApplication[]> {
    const collection = await getApplicationsCollection();

    const result = await collection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $sort: {createdAt: -1}
        }
    ]).toArray();

    return result as BookApplication[];
}

export async function updateApplicationStatus(
    applicationId: ObjectId,
    status: 'approved' | 'rejected',
    adminComment?: string
): Promise<void> {
    const collection = await getApplicationsCollection();

    await collection.updateOne(
        {_id: applicationId},
        {
            $set: {
                status,
                adminComment,
                updatedAt: new Date(),
            },
        }
    );
}

export async function deleteApplication(applicationId: ObjectId): Promise<void> {
    const collection = await getApplicationsCollection();
    await collection.deleteOne({_id: applicationId});
}
