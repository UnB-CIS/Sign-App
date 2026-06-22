jest.mock('../../../models/courses', () => ({
  getCourseById: jest.fn(),
}));

jest.mock('../../../models/lessons', () => ({
  getLessonById: jest.fn(),
}));

import { getCourseById } from '../../../models/courses';
import { getLessonById } from '../../../models/lessons';
import { getLessonContent, getModuleDetail } from '../../../models/courseContent';

describe('courseContent (Firestore-first com fallback)', () => {
  const mockedGetCourseById = getCourseById as jest.MockedFunction<typeof getCourseById>;
  const mockedGetLessonById = getLessonById as jest.MockedFunction<typeof getLessonById>;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetCourseById.mockReset();
    mockedGetLessonById.mockReset();
  });

  it('lê o módulo do Firestore quando disponível', async () => {
    mockedGetCourseById.mockResolvedValue({
      id: 'libras-basico',
      title: 'Libras Básico',
      modules: [
        {
          moduleId: 'mod-1',
          title: 'Saudações Remoto',
          order: 1,
          description: 'Descrição remota',
          objective: 'Objetivo remoto',
          iconName: 'hand-wave',
          lessons: [{ lessonId: 'les-1-1', title: 'Olá e Tchau', type: 'standard', order: 1 }],
        },
      ],
    } as never);

    const detail = await getModuleDetail('mod-1');

    expect(detail?.title).toBe('Saudações Remoto');
    expect(detail?.description).toBe('Descrição remota');
    expect(detail?.lessons).toHaveLength(1);
  });

  it('cai no fallback de modules.ts quando o Firestore vem vazio', async () => {
    mockedGetCourseById.mockResolvedValue({ id: 'libras-basico', title: 'Libras Básico', modules: [] } as never);

    const detail = await getModuleDetail('mod-1');

    expect(detail?.id).toBe('mod-1');
    expect(detail?.title).toBe('Saudações');
  });

  it('cai no fallback quando o Firestore lança erro', async () => {
    mockedGetCourseById.mockRejectedValue(new Error('offline'));

    const detail = await getModuleDetail('mod-1');

    expect(detail?.id).toBe('mod-1');
    expect(detail?.title).toBe('Saudações');
  });

  it('lê a lição do Firestore quando há vocabulário', async () => {
    mockedGetLessonById.mockResolvedValue({
      id: 'les-1-1',
      title: 'Olá e Tchau',
      courseId: 'libras-basico',
      moduleId: 'mod-1',
      xpReward: 50,
      vocabulary: [{ id: 'v-1', word: 'Olá Remoto', translation: 'tradução remota' }],
      expressions: ['Olá!'],
      questions: [],
    } as never);

    const lesson = await getLessonContent('les-1-1', 'mod-1');

    expect(lesson?.vocabulary[0].word).toBe('Olá Remoto');
  });

  it('cai no fallback de modules.ts quando a lição remota vem sem vocabulário', async () => {
    mockedGetLessonById.mockResolvedValue(null);

    const lesson = await getLessonContent('les-1-1', 'mod-1');

    expect(lesson?.id).toBe('les-1-1');
    expect(lesson?.vocabulary[0].word).toBe('Olá');
  });
});
