jest.mock('../../../models/courses', () => ({
  getCourseById: jest.fn(),
}));

jest.mock('../../../models/userProgress', () => ({
  ensureProgressForUserCourse: jest.fn(),
}));

import { getCourseById } from '../../../models/courses';
import { ensureProgressForUserCourse } from '../../../models/userProgress';
import { getCourseModulesOverview } from '../../../models/courseOverview';

describe('courseOverview model', () => {
  const mockedGetCourseById = getCourseById as jest.MockedFunction<typeof getCourseById>;
  const mockedEnsureProgressForUserCourse = ensureProgressForUserCourse as jest.MockedFunction<typeof ensureProgressForUserCourse>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('combines course modules with user progress from Firestore', async () => {
    mockedGetCourseById.mockResolvedValue({
      id: 'libras-basico',
      title: 'Libras Básico',
      description: 'Curso introdutório',
      modules: [
        {
          moduleId: 'mod-1',
          title: 'Saudações',
          order: 1,
          lessons: [
            { lessonId: 'les-1-1', title: 'Olá e Tchau', type: 'standard', order: 1 },
            { lessonId: 'les-1-2', title: 'Apresentações', type: 'standard', order: 2 },
          ],
        },
        {
          moduleId: 'mod-2',
          title: 'Alimentos',
          order: 2,
          lessons: [
            { lessonId: 'les-2-1', title: 'Frutas', type: 'standard', order: 1 },
          ],
        },
      ],
    } as never);

    mockedEnsureProgressForUserCourse.mockResolvedValue({
      id: 'progress-1',
      userId: 'user-123',
      courseId: 'libras-basico',
      completedLessons: ['les-1-1'],
      lessonScores: {},
      unlockedModules: ['mod-1', 'mod-2'],
    } as never);

    const result = await getCourseModulesOverview('user-123');

    expect(mockedGetCourseById).toHaveBeenCalledWith('libras-basico');
    expect(mockedEnsureProgressForUserCourse).toHaveBeenCalledWith('user-123', 'libras-basico', 'mod-1');
    expect(result).toEqual([
      expect.objectContaining({
        id: 'mod-1',
        title: 'Saudações',
        totalLessons: 2,
        completedLessons: 1,
        progress: 50,
        locked: false,
      }),
      expect.objectContaining({
        id: 'mod-2',
        title: 'Alimentos',
        totalLessons: 1,
        completedLessons: 0,
        progress: 0,
        locked: false,
      }),
    ]);
  });

  it('returns an empty list when the course is missing', async () => {
    mockedGetCourseById.mockResolvedValue(null);

    const result = await getCourseModulesOverview('user-123');

    expect(result).toEqual([]);
    expect(mockedEnsureProgressForUserCourse).not.toHaveBeenCalled();
  });
});
