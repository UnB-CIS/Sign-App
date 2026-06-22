/**
 * Script para popular o Firebase com dados das lições.
 * Executar com: npx ts-node src/scripts/seedLessons.ts
 *
 * Idempotente: faz upsert por id (createCourse/createLesson usam setDoc e
 * addModule faz upsert por moduleId). Reexecutar não duplica nem deleta nada.
 */
import { MODULES } from '../data/modules';
import { createCourse, addModule, CourseLessonRef, CourseModule } from '../services/models/courses';
import { createLesson, StorableLesson, LessonQuestion } from '../services/models/lessons';

const COURSE_ID = 'libras-basico';

async function seed() {
  console.log('Criando curso Libras Básico...');
  await createCourse({
    id: COURSE_ID,
    title: 'Libras Básico',
    description: 'Curso introdutório de Língua Brasileira de Sinais',
    targetLanguage: 'libras',
    sourceLanguage: 'pt-BR',
  });

  for (const mod of MODULES) {
    console.log(`Adicionando módulo: ${mod.title}`);

    const lessonRefs: CourseLessonRef[] = [];

    for (const lesson of mod.lessons) {
      const questions: LessonQuestion[] = lesson.activities.flatMap((act) =>
        act.questions.map((q) => ({
          type: q.type,
          prompt: q.prompt,
          options: q.options,
          correctAnswer: q.correctAnswer,
          url_video: q.url_video ?? q.videoUrl,
          url_videos: q.url_videos,
          targetWord: q.targetWord,
          instruction: q.instruction,
        } as LessonQuestion))
      );

      const storableLesson: Partial<StorableLesson> = {
        id: lesson.id,
        title: lesson.title,
        courseId: COURSE_ID,
        moduleId: mod.id,
        description: lesson.description,
        order: lesson.order,
        xpReward: lesson.xpReward,
        vocabulary: lesson.vocabulary.map((v) => ({
          id: v.id,
          word: v.word,
          translation: v.translation,
          videoUrl: v.videoUrl,
          imageUrl: v.imageUrl,
        })),
        expressions: lesson.expressions,
        grammar: lesson.grammar,
        questions,
      };

      await createLesson(storableLesson);
      lessonRefs.push({
        lessonId: lesson.id,
        title: lesson.title,
        type: 'standard',
        order: lesson.order,
      });
    }

    const courseModule: CourseModule = {
      moduleId: mod.id,
      title: mod.title,
      order: mod.order,
      description: mod.description,
      objective: mod.objective,
      iconName: mod.iconName,
      lessons: lessonRefs,
    };
    await addModule(COURSE_ID, courseModule);
  }

  console.log('Seed completo!');
}

seed().catch(console.error);
