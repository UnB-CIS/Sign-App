import { MODULES } from '../../data/modules';
import { getCourseById } from './courses';
import { ensureProgressForUserCourse } from './userProgress';

export const DEFAULT_COURSE_ID = 'libras-basico';

export interface ModuleOverview {
  id: string;
  title: string;
  description: string;
  objective: string;
  iconName: string;
  order: number;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  locked: boolean;
}

export async function getCourseModulesOverview(
  userId: string,
  courseId = DEFAULT_COURSE_ID
): Promise<ModuleOverview[]> {
  const course = await getCourseById(courseId);
  if (!course?.modules?.length) {
    return [];
  }

  const sortedModules = [...course.modules].sort((a, b) => a.order - b.order);
  const firstModuleId = sortedModules[0]?.moduleId;
  const progress = await ensureProgressForUserCourse(userId, courseId, firstModuleId);
  const completedLessons = new Set(progress?.completedLessons ?? []);
  const unlockedModules = new Set(progress?.unlockedModules ?? (firstModuleId ? [firstModuleId] : []));

  return sortedModules.map((module, index) => {
    // Firestore primeiro; modules.ts apenas como fallback offline.
    const localModule = MODULES.find((item) => item.id === module.moduleId);
    const totalLessons = module.lessons.length;
    const completedCount = module.lessons.filter((lesson) => completedLessons.has(lesson.lessonId)).length;
    const progressPercent = totalLessons === 0
      ? 0
      : Math.round((completedCount / totalLessons) * 100);

    return {
      id: module.moduleId,
      title: module.title,
      description: module.description ?? localModule?.description ?? course.description ?? 'Continue evoluindo neste módulo.',
      objective: module.objective ?? localModule?.objective ?? 'Concluir as lições deste módulo.',
      iconName: module.iconName ?? localModule?.iconName ?? 'school',
      order: module.order,
      totalLessons,
      completedLessons: completedCount,
      progress: progressPercent,
      locked: index === 0 ? false : !unlockedModules.has(module.moduleId),
    };
  });
}
