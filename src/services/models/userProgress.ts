import { serverTimestamp, collection, setDoc, getDoc, updateDoc, arrayUnion, runTransaction, DocumentData, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';
export interface Lessons {
    score: number;
    lastCompletedAt: any;
}

export interface StorableUserProgress {
    id?: string;
    userId: string;
    courseId: string;
    completedLessons: string[];
    lessonScores: Record<string, Lessons>;
    unlockedModules: string[];
}

export async function createProgress(userId: string, courseId: string, initial?: Partial<StorableUserProgress>) {
    const data = {
        userId,
        courseId,
        completedLessons: [],
        lessonScores: {},
        unlockedModules: [],
        createdAt: serverTimestamp(),
        ...initial,
    } as Partial<StorableUserProgress>;

    const ref = await addDoc(collection(db, Collections.USERPROGRESS), data);
    return ref.id; // Firestore-generated document id
}

export async function getProgressById(id: string): Promise<(StorableUserProgress & { id: string }) | null> {
    try {
        const ref = doc(db, Collections.USERPROGRESS, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return null;

        const data = { ...(snap.data() as StorableUserProgress), id: snap.id };
        return data;
    } catch (err) {
        console.error('getProgressById error', err);
        throw err;
    }
}

export async function updateProgress(id: string, updates: Partial<StorableUserProgress>) {
    const ref = doc(db, Collections.USERPROGRESS, id);
    try {
        await updateDoc(ref, updates as DocumentData);
    } catch (err) {
        console.error('updateProgress error', err);
        throw err;
    }
}

export async function deleteProgress(id: string) {
    const ref = doc(db, Collections.USERPROGRESS, id);
    try {
        await deleteDoc(ref);
    } catch (err) {
        console.error('deleteProgress error', err);
        throw err;
    }
}

