// src/services/models/__tests__/courses.emu.test.ts
jest.setTimeout(20000);

const { connectFirestoreEmulator } = require('firebase/firestore');
const { db } = require('../../../firebase'); // the real exported db
const courses = require('../../../models/courses'); // module under test
const { getCourseById, deleteCourse } = courses;

beforeAll(() => {
    // make sure emulator is running at localhost:8080
    connectFirestoreEmulator(db, 'localhost', 8080);
});

test('createCourse actually writes and can be read back from emulator', async () => {
    const id = await courses.createCourse({

        title: 'libras for pt - test',
        description: 'test course',
    });

    const course = await getCourseById(id);
    expect(course).not.toBeNull();
    expect(course.title).toBe('libras for pt - test');

    // cleanup
    await deleteCourse(id);
});