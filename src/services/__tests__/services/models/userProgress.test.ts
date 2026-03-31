jest.mock('../../../firebase', () => ({
  db: 'mock-db',
}));

jest.mock('firebase/firestore', () => ({
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  collection: jest.fn((_db, name) => `collection:${name}`),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn((_db, collectionName, id) => `${collectionName}/${id}`),
  getDocs: jest.fn(),
  query: jest.fn((...parts) => parts),
  where: jest.fn((...parts) => parts),
}));

jest.mock('../../../models/courses', () => ({
  getCourseById: jest.fn(),
}));

jest.mock('../../../models/user', () => ({
  applyLessonRewards: jest.fn(),
}));

import { getDocs, updateDoc } from 'firebase/firestore';
import { getCourseById } from '../../../models/courses';
import { applyLessonRewards } from '../../../models/user';
import { completeLessonProgress, getModuleLessonProgress } from '../../../models/userProgress';

describe('userProgress model', () => {
  const mockedGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
  const mockedUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
  const mockedGetCourseById = getCourseById as jest.MockedFunction<typeof getCourseById>;
  const mockedApplyLessonRewards = applyLessonRewards as jest.MockedFunction<typeof applyLessonRewards>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetCourseById.mockResolvedValue({
      id: 'libras-basico',
      title: 'Libras Básico',
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
  });

  it('returns lesson lock state based on previous completions', async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'progress-1',
          data: () => ({
            userId: 'user-123',
            courseId: 'libras-basico',
            completedLessons: ['les-1-1'],
            lessonScores: {},
            unlockedModules: ['mod-1'],
          }),
        },
      ],
    } as never);

    const result = await getModuleLessonProgress('user-123', 'mod-1');

    expect(result).toEqual([
      { lessonId: 'les-1-1', completed: true, locked: false },
      { lessonId: 'les-1-2', completed: false, locked: false },
    ]);
  });

  it('completes the lesson, unlocks the next module and awards xp once', async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'progress-1',
          data: () => ({
            userId: 'user-123',
            courseId: 'libras-basico',
            completedLessons: ['les-1-1'],
            lessonScores: {},
            unlockedModules: ['mod-1'],
          }),
        },
      ],
    } as never);

    const result = await completeLessonProgress({
      userId: 'user-123',
      lessonId: 'les-1-2',
      moduleId: 'mod-1',
      score: 100,
      xpEarned: 50,
    });

    expect(mockedUpdateDoc).toHaveBeenCalledTimes(1);
    expect(mockedUpdateDoc.mock.calls[0][1]).toEqual(expect.objectContaining({
      completedLessons: ['les-1-1', 'les-1-2'],
      unlockedModules: ['mod-1', 'mod-2'],
      updatedAt: undefined,
    }));
    expect(mockedApplyLessonRewards).toHaveBeenCalledWith('user-123', 50);
    expect(result).toEqual({
      alreadyCompleted: false,
      unlockedModules: ['mod-1', 'mod-2'],
      completedLessons: ['les-1-1', 'les-1-2'],
    });
  });

  it('does not award xp again for an already completed lesson', async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'progress-1',
          data: () => ({
            userId: 'user-123',
            courseId: 'libras-basico',
            completedLessons: ['les-1-1'],
            lessonScores: {},
            unlockedModules: ['mod-1'],
          }),
        },
      ],
    } as never);

    await completeLessonProgress({
      userId: 'user-123',
      lessonId: 'les-1-1',
      moduleId: 'mod-1',
      score: 90,
      xpEarned: 50,
    });

    expect(mockedApplyLessonRewards).not.toHaveBeenCalled();
  });
});
