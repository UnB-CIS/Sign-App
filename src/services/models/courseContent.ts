import { MODULES } from '../../data/modules';
import type { Lesson, Module } from '../../data/types';
import { getCourseById } from './courses';
import { getLessonById } from './lessons';

export const DEFAULT_COURSE_ID = 'libras-basico';

export interface ModuleLessonItem {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  objective: string;
  iconName: string;
  order: number;
  lessons: ModuleLessonItem[];
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  vocabulary: { id: string; word: string; translation: string }[];
  expressions: string[];
  questions: Lesson['activities'][number]['questions'];
}

// Estratégia Firestore-first com fallback resiliente:
// tenta a fonte remota; se vier vazia ou lançar erro, usa modules.ts offline.
async function firestoreFirst<T>(
  remote: () => Promise<T | null | undefined>,
  fallback: () => T | undefined
): Promise<T | undefined> {
  try {
    const value = await remote();
    if (value) {
      return value;
    }
  } catch (error) {
    console.error('courseContent: falha ao ler do Firestore, usando fallback offline', error);
  }
  return fallback();
}

function moduleToDetail(mod: Module): ModuleDetail {
  return {
    id: mod.id,
    title: mod.title,
    description: mod.description,
    objective: mod.objective,
    iconName: mod.iconName,
    order: mod.order,
    lessons: mod.lessons
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        xpReward: lesson.xpReward,
      })),
  };
}

function lessonToContent(lesson: Lesson): LessonContent {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    order: lesson.order,
    xpReward: lesson.xpReward,
    vocabulary: lesson.vocabulary.map((item) => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
    })),
    expressions: lesson.expressions,
    questions: lesson.activities.flatMap((activity) => activity.questions),
  };
}

function fallbackModule(moduleId: string): ModuleDetail | undefined {
  const mod = MODULES.find((item) => item.id === moduleId);
  return mod ? moduleToDetail(mod) : undefined;
}

function fallbackLesson(moduleId: string, lessonId: string): LessonContent | undefined {
  const mod = MODULES.find((item) => item.id === moduleId);
  const lesson = mod?.lessons.find((item) => item.id === lessonId);
  return lesson ? lessonToContent(lesson) : undefined;
}

export async function getModuleDetail(
  moduleId: string,
  courseId = DEFAULT_COURSE_ID
): Promise<ModuleDetail | undefined> {
  return firestoreFirst<ModuleDetail>(
    async () => {
      const course = await getCourseById(courseId);
      const remoteModule = course?.modules?.find((item) => item.moduleId === moduleId);
      if (!remoteModule || !remoteModule.lessons?.length) {
        return null;
      }
      const localModule = MODULES.find((item) => item.id === moduleId);
      const lessons = remoteModule.lessons
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((ref) => {
          const localLesson = localModule?.lessons.find((item) => item.id === ref.lessonId);
          return {
            id: ref.lessonId,
            title: ref.title,
            description: localLesson?.description ?? '',
            order: ref.order,
            xpReward: localLesson?.xpReward ?? 0,
          };
        });
      return {
        id: remoteModule.moduleId,
        title: remoteModule.title,
        description: remoteModule.description ?? localModule?.description ?? '',
        objective: remoteModule.objective ?? localModule?.objective ?? '',
        iconName: remoteModule.iconName ?? localModule?.iconName ?? 'school',
        order: remoteModule.order,
        lessons,
      };
    },
    () => fallbackModule(moduleId)
  );
}

export async function getLessonContent(
  lessonId: string,
  moduleId: string,
  courseId = DEFAULT_COURSE_ID
): Promise<LessonContent | undefined> {
  return firestoreFirst<LessonContent>(
    async () => {
      const remote = await getLessonById(lessonId);
      if (!remote || !remote.vocabulary?.length) {
        return null;
      }
      const localLesson = MODULES.find((item) => item.id === moduleId)?.lessons.find(
        (item) => item.id === lessonId
      );
      return {
        id: remote.id,
        title: remote.title,
        description: remote.description ?? localLesson?.description ?? '',
        order: remote.order ?? localLesson?.order ?? 0,
        xpReward: remote.xpReward ?? localLesson?.xpReward ?? 0,
        vocabulary: remote.vocabulary.map((item) => ({
          id: item.id,
          word: item.word,
          translation: item.translation,
        })),
        expressions: remote.expressions ?? localLesson?.expressions ?? [],
        questions: (remote.questions ?? []) as LessonContent['questions'],
      };
    },
    () => fallbackLesson(moduleId, lessonId)
  );
}
