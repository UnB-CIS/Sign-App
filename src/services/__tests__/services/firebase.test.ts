jest.resetModules();

// create the mock inside the factory — DO NOT reference outer variables here
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn((cfg) => ({ options: cfg })),
}));
// Return a non-undefined value from the mocked getters so the module's
// `export const auth = getAuth(app)` and `export const db = getFirestore(app)`
// produce defined exports that tests can assert on.
jest.mock('firebase/auth', () => ({ getAuth: jest.fn(() => ({ mockedAuth: true })) }));
jest.mock('firebase/firestore', () => ({ getFirestore: jest.fn(() => ({ mockedDb: true })) }));

test('initializes with only apiKey present', () => {
    // require after mocks so module picks up our mocks
    const service = require('../../firebase');

    // retrieve the mock created inside the factory
    const { initializeApp } = require('firebase/app');

    expect(initializeApp).toHaveBeenCalled();
    const cfg = initializeApp.mock.calls[0][0];
    expect(cfg.apiKey).not.toBeNull();
    expect(service.auth).toBeDefined();
    expect(service.db).toBeDefined();
});