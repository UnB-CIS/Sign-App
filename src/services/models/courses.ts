import {
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
    runTransaction,
    serverTimestamp,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';

export interface CourseLessonRef {
    lessonId: string;
    title: string;
    type: string;
    order: number;
}

export interface CourseModule {
    moduleId: string;
    title: string;
    order: number;
    description?: string;
    objective?: string;
    iconName?: string;
    lessons: CourseLessonRef[];
}

export interface StorableCourse {
    id?: string;
    title: string;
    description?: string;
    targetLanguage?: string;
    sourceLanguage?: string;
    totalModules?: number;
    iconUrl?: string;
    modules?: CourseModule[];
    createdAt?: any;
    updatedAt?: any;
}

export async function createCourse(initial: Partial<StorableCourse>) {
    const data: Partial<StorableCourse> = {
        title: initial.title ?? 'Untitled Course',
        description: initial.description ?? '',
        targetLanguage: initial.targetLanguage ?? '',
        sourceLanguage: initial.sourceLanguage ?? '',
        totalModules: initial.totalModules ?? (initial.modules ? initial.modules.length : 0),
        iconUrl: initial.iconUrl,
        modules: initial.modules ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...initial,
    };

    if (initial.id) {
        const ref = doc(db, Collections.COURSES, initial.id);
        await setDoc(ref, data as DocumentData);
        return initial.id;
    }

    const ref = await addDoc(collection(db, Collections.COURSES), data as DocumentData);
    return ref.id;
}

export async function getCourseById(id: string): Promise<(StorableCourse & { id: string }) | null> {
    const ref = doc(db, Collections.COURSES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { ...(snap.data() as StorableCourse), id: snap.id };
}

export async function updateCourse(id: string, updates: Partial<StorableCourse>) {
    const ref = doc(db, Collections.COURSES, id);
    try {
        await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() } as DocumentData);
    } catch (err) {
        console.error('updateCourse error', err);
        throw err;
    }
}

export async function deleteCourse(id: string) {
    const ref = doc(db, Collections.COURSES, id);
    try {
        await deleteDoc(ref);
    } catch (err) {
        console.error('deleteCourse error', err);
        throw err;
    }
}

export async function listCoursesBySource(sourceLanguage?: string) {
    if (!sourceLanguage) {
        const snaps = await getDocs(collection(db, Collections.COURSES));
        return snaps.docs.map((s) => ({ ...(s.data() as StorableCourse), id: s.id }));
    }
    const q = query(collection(db, Collections.COURSES), where('sourceLanguage', '==', sourceLanguage));
    const snaps = await getDocs(q);
    return snaps.docs.map((s) => ({ ...(s.data() as StorableCourse), id: s.id }));
}

export async function addModule(courseId: string, module: CourseModule) {
    const ref = doc(db, Collections.COURSES, courseId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Course not found');
            const data = snap.data() as StorableCourse;
            const modules = data.modules ?? [];
            const exists = modules.find((m) => m.moduleId === module.moduleId);
            if (exists) {
                const updated = modules.map((m) => (m.moduleId === module.moduleId ? { ...m, ...module } : m));
                tx.update(ref, { modules: updated, updatedAt: serverTimestamp() } as DocumentData);
            } else {
                modules.push(module);
                tx.update(ref, { modules, totalModules: modules.length, updatedAt: serverTimestamp() } as DocumentData);
            }
        });
    } catch (err) {
        console.error('addModule error', err);
        throw err;
    }
}

export async function removeModule(courseId: string, moduleId: string) {
    const ref = doc(db, Collections.COURSES, courseId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Course not found');
            const data = snap.data() as StorableCourse;
            const modules = (data.modules ?? []).filter((m) => m.moduleId !== moduleId);
            tx.update(ref, { modules, totalModules: modules.length, updatedAt: serverTimestamp() } as DocumentData);
        });
    } catch (err) {
        console.error('removeModule error', err);
        throw err;
    }
}

export async function addLessonToModule(courseId: string, moduleId: string, lesson: CourseLessonRef) {
    const ref = doc(db, Collections.COURSES, courseId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Course not found');
            const data = snap.data() as StorableCourse;
            const modules = data.modules ?? [];
            const idx = modules.findIndex((m) => m.moduleId === moduleId);
            if (idx === -1) throw new Error('Module not found');
            const module = modules[idx];
            const lessons = module.lessons ?? [];
            const exists = lessons.find((l) => l.lessonId === lesson.lessonId);
            if (exists) {
                const updatedLessons = lessons.map((l) => (l.lessonId === lesson.lessonId ? { ...l, ...lesson } : l));
                modules[idx] = { ...module, lessons: updatedLessons };
            } else {
                lessons.push(lesson);
                modules[idx] = { ...module, lessons };
            }
            tx.update(ref, { modules, updatedAt: serverTimestamp() } as DocumentData);
        });
    } catch (err) {
        console.error('addLessonToModule error', err);
        throw err;
    }
}

export async function removeLessonFromModule(courseId: string, moduleId: string, lessonId: string) {
    const ref = doc(db, Collections.COURSES, courseId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Course not found');
            const data = snap.data() as StorableCourse;
            const modules = data.modules ?? [];
            const idx = modules.findIndex((m) => m.moduleId === moduleId);
            if (idx === -1) throw new Error('Module not found');
            const module = modules[idx];
            const lessons = (module.lessons ?? []).filter((l) => l.lessonId !== lessonId);
            modules[idx] = { ...module, lessons };
            tx.update(ref, { modules, updatedAt: serverTimestamp() } as DocumentData);
        });
    } catch (err) {
        console.error('removeLessonFromModule error', err);
        throw err;
    }
}
