import { serverTimestamp, collection, getDoc, updateDoc, DocumentData, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';
import { getCourseById } from './courses';
import { applyLessonRewards } from './user';
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

const DEFAULT_COURSE_ID = 'libras-basico';

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

export async function getProgressByUserAndCourse(
    userId: string,
    courseId: string
): Promise<(StorableUserProgress & { id: string }) | null> {
    try {
        const progressQuery = query(
            collection(db, Collections.USERPROGRESS),
            where('userId', '==', userId),
            where('courseId', '==', courseId)
        );

        const snaps = await getDocs(progressQuery);
        const progressDoc = snaps.docs[0];

        if (!progressDoc) return null;

        return {
            ...(progressDoc.data() as StorableUserProgress),
            id: progressDoc.id,
        };
    } catch (err) {
        console.error('getProgressByUserAndCourse error', err);
        throw err;
    }
}

export async function ensureProgressForUserCourse(
    userId: string,
    courseId: string,
    initialUnlockedModuleId?: string
) {
    const existing = await getProgressByUserAndCourse(userId, courseId);
    if (existing) {
        return existing;
    }

    const progressId = await createProgress(userId, courseId, {
        unlockedModules: initialUnlockedModuleId ? [initialUnlockedModuleId] : [],
    });

    return getProgressById(progressId);
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

export async function getModuleLessonProgress(
    userId: string,
    moduleId: string,
    courseId = DEFAULT_COURSE_ID
) {
    const course = await getCourseById(courseId);
    const sortedModules = [...(course?.modules ?? [])].sort((a, b) => a.order - b.order);
    const firstModuleId = sortedModules[0]?.moduleId;
    const progress = await ensureProgressForUserCourse(userId, courseId, firstModuleId);
    const module = sortedModules.find((item) => item.moduleId === moduleId);

    if (!module) {
        return [];
    }

    const completedLessons = new Set(progress?.completedLessons ?? []);
    const orderedLessons = [...module.lessons].sort((a, b) => a.order - b.order);

    return orderedLessons.map((lesson, index) => {
        const previousLessonId = orderedLessons[index - 1]?.lessonId;
        const locked = index > 0 && previousLessonId ? !completedLessons.has(previousLessonId) : false;

        return {
            lessonId: lesson.lessonId,
            completed: completedLessons.has(lesson.lessonId),
            locked,
        };
    });
}

export async function completeLessonProgress(
    {
        userId,
        lessonId,
        moduleId,
        score,
        xpEarned,
        courseId = DEFAULT_COURSE_ID,
    }: {
        userId: string;
        lessonId: string;
        moduleId: string;
        score: number;
        xpEarned: number;
        courseId?: string;
    }
) {
    const course = await getCourseById(courseId);
    const sortedModules = [...(course?.modules ?? [])].sort((a, b) => a.order - b.order);
    const firstModuleId = sortedModules[0]?.moduleId;
    const progress = await ensureProgressForUserCourse(userId, courseId, firstModuleId);
    const module = sortedModules.find((item) => item.moduleId === moduleId);

    if (!progress?.id || !module) {
        throw new Error('Progresso do curso não encontrado.');
    }

    const orderedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
    const lessonIndex = orderedLessons.findIndex((item) => item.lessonId === lessonId);

    if (lessonIndex === -1) {
        throw new Error('Lição não encontrada no módulo.');
    }

    const completedLessons = new Set(progress.completedLessons ?? []);
    const unlockedModules = new Set(progress.unlockedModules ?? (firstModuleId ? [firstModuleId] : []));
    const lessonScores = { ...(progress.lessonScores ?? {}) };
    const alreadyCompleted = completedLessons.has(lessonId);

    completedLessons.add(lessonId);
    unlockedModules.add(moduleId);
    lessonScores[lessonId] = {
        score,
        lastCompletedAt: new Date().toISOString(),
    };

    const nextLesson = orderedLessons[lessonIndex + 1];
    const completedCurrentModule = orderedLessons.every((item) => completedLessons.has(item.lessonId));

    if (!nextLesson && completedCurrentModule) {
        const moduleIndex = sortedModules.findIndex((item) => item.moduleId === moduleId);
        const nextModule = sortedModules[moduleIndex + 1];
        if (nextModule) {
            unlockedModules.add(nextModule.moduleId);
        }
    }

    await updateProgress(progress.id, {
        completedLessons: Array.from(completedLessons),
        lessonScores,
        unlockedModules: Array.from(unlockedModules),
        updatedAt: serverTimestamp(),
    });

    if (!alreadyCompleted && xpEarned > 0) {
        await applyLessonRewards(userId, xpEarned);
    }

    return {
        alreadyCompleted,
        unlockedModules: Array.from(unlockedModules),
        completedLessons: Array.from(completedLessons),
    };
}
