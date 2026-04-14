import {
    serverTimestamp,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';

export type MultipleChoiceQuestion = {
    type: 'multiple_choice';
    prompt: string;
    options: string[];
    correctAnswer: string; // index or id as string
    url_video?: string;
    targetWord?: string;
};

export type VideoRecordQuestion = {
    type: 'video_record';
    prompt: string;
    url_video?: string;
    correctAnswer?: string;
    targetWord?: string;
    instruction?: string;
};

export type MultipleChoiceVideoQuestion = {
    type: 'multiple_choice_video';
    prompt: string;
    url_videos: string[];
    correctAnswer: string;
    targetWord?: string;
};

export type LessonQuestion =
    | MultipleChoiceQuestion
    | VideoRecordQuestion
    | MultipleChoiceVideoQuestion;

export interface StorableLesson {
    id?: string;
    title: string;
    courseId: string;
    moduleId: string;
    requirements?: string;
    questions: LessonQuestion[];
    createdAt?: any;
    updatedAt?: any;
}

export async function createLesson(initial: Partial<StorableLesson>) {
    const data: Partial<StorableLesson> = {
        title: initial.title ?? 'Untitled',
        courseId: initial.courseId ?? '',
        moduleId: initial.moduleId ?? '',
        requirements: initial.requirements,
        questions: initial.questions ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...initial,
    };

    if (initial.id) {
        const ref = doc(db, Collections.LESSONS, initial.id);
        await setDoc(ref, data as DocumentData);
        return initial.id;
    }

    const ref = await addDoc(collection(db, Collections.LESSONS), data as DocumentData);
    return ref.id;
}

export async function getLessonById(id: string): Promise<(StorableLesson & { id: string }) | null> {
    const ref = doc(db, Collections.LESSONS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = { ...(snap.data() as StorableLesson), id: snap.id };
    return data;
}

export async function updateLesson(id: string, updates: Partial<StorableLesson>) {
    const ref = doc(db, Collections.LESSONS, id);
    try {
        await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() } as DocumentData);
    } catch (err) {
        console.error('updateLesson error', err);
        throw err;
    }
}

export async function deleteLesson(id: string) {
    const ref = doc(db, Collections.LESSONS, id);
    try {
        await deleteDoc(ref);
    } catch (err) {
        console.error('deleteLesson error', err);
        throw err;
    }
}

export async function listLessonsByCourse(courseId: string, moduleId?: string) {
    const q = moduleId
        ? query(collection(db, Collections.LESSONS), where('courseId', '==', courseId), where('moduleId', '==', moduleId))
        : query(collection(db, Collections.LESSONS), where('courseId', '==', courseId));

    const snaps = await getDocs(q);
    return snaps.docs.map((s) => ({ ...(s.data() as StorableLesson), _id: s.id }));
}
