jest.mock('../../../firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: 'mock-db',
}));

jest.mock('firebase/firestore', () => ({
  Timestamp: class Timestamp {},
  deleteField: jest.fn(() => '__DELETE_FIELD__'),
  doc: jest.fn((_db, collection, id) => `${collection}/${id}`),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

import { auth } from '../../../firebase';
import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Collections } from '../../../enums';
import { signInWithEmail, updateUserProfile } from '../../../models/user';

describe('user model', () => {
  const mockedDeleteField = deleteField as jest.MockedFunction<typeof deleteField>;
  const mockedDoc = doc as jest.MockedFunction<typeof doc>;
  const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
  const mockedSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
  const mockedSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
  const mockedUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
  const mockedAuth = auth as { currentUser: null | { uid: string; email?: string | null; displayName?: string | null } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedDeleteField.mockImplementation(() => '__DELETE_FIELD__' as never);
    mockedDoc.mockImplementation(((_db, collection, id) => `${collection}/${id}`) as typeof doc);
    mockedAuth.currentUser = null;
  });

  describe('updateUserProfile', () => {
    it('persists trimmed profile fields to Firestore', async () => {
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ _id: 'user-123' }),
      } as never);
      mockedAuth.currentUser = {
        uid: 'user-123',
        email: 'maria@example.com',
        displayName: 'Maria Silva',
      };

      await updateUserProfile('user-123', {
        name: '  Maria Silva  ',
        phone: ' (61) 99999-9999 ',
        gender: ' Feminino ',
        birth_date: ' 31/12/2000 ',
      });

      expect(mockedDoc).toHaveBeenCalledWith('mock-db', Collections.USERS, 'user-123');
      expect(mockedUpdateDoc).toHaveBeenCalledWith(`${Collections.USERS}/user-123`, {
        name: 'Maria Silva',
        phone: '(61) 99999-9999',
        gender: 'Feminino',
        birth_date: '31/12/2000',
      });
    });

    it('removes optional empty fields instead of saving blank strings', async () => {
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ _id: 'user-123' }),
      } as never);
      mockedAuth.currentUser = {
        uid: 'user-123',
        email: 'maria@example.com',
        displayName: 'Maria',
      };

      await updateUserProfile('user-123', {
        name: 'Maria',
        phone: '   ',
        gender: '',
        birth_date: ' ',
      });

      expect(mockedDeleteField).toHaveBeenCalledTimes(3);
      expect(mockedUpdateDoc).toHaveBeenCalledWith(`${Collections.USERS}/user-123`, {
        name: 'Maria',
        phone: '__DELETE_FIELD__',
        gender: '__DELETE_FIELD__',
        birth_date: '__DELETE_FIELD__',
      });
    });

    it('rejects invalid phone numbers', async () => {
      await expect(
        updateUserProfile('user-123', {
          name: 'Maria',
          phone: '12345',
        }),
      ).rejects.toThrow('Informe um telefone com 10 ou 11 dígitos.');

      expect(mockedUpdateDoc).not.toHaveBeenCalled();
    });

    it('rejects invalid birth dates', async () => {
      await expect(
        updateUserProfile('user-123', {
          name: 'Maria',
          birth_date: '31/02/2000',
        }),
      ).rejects.toThrow('Informe a data de nascimento no formato DD/MM/AAAA.');

      expect(mockedUpdateDoc).not.toHaveBeenCalled();
    });

    it('rejects empty names', async () => {
      await expect(
        updateUserProfile('user-123', {
          name: '   ',
        }),
      ).rejects.toThrow('Preencha o nome completo.');

      expect(mockedUpdateDoc).not.toHaveBeenCalled();
    });

    it('creates a base profile before updating when the document is missing', async () => {
      mockedGetDoc.mockResolvedValue({
        exists: () => false,
      } as never);
      mockedAuth.currentUser = {
        uid: 'user-123',
        email: 'maria@example.com',
        displayName: 'Maria Silva',
      };

      await updateUserProfile('user-123', {
        name: 'Maria Silva',
      });

      expect(mockedSetDoc).toHaveBeenCalledWith(`${Collections.USERS}/user-123`, expect.objectContaining({
        _id: 'user-123',
        email: 'maria@example.com',
        username: 'maria',
        name: 'Maria Silva',
      }));
      expect(mockedUpdateDoc).toHaveBeenCalledWith(`${Collections.USERS}/user-123`, {
        name: 'Maria Silva',
      });
    });
  });

  describe('signInWithEmail', () => {
    it('creates the missing profile document after a successful login', async () => {
      const authUser = { uid: 'user-123', email: 'maria@example.com' };

      mockedSignInWithEmailAndPassword.mockResolvedValue({
        user: authUser,
      } as never);
      mockedGetDoc.mockResolvedValue({
        exists: () => false,
      } as never);

      const result = await signInWithEmail('maria@example.com', 'password123');

      expect(result).toEqual({
        authUser,
        profile: expect.objectContaining({
          _id: 'user-123',
          email: 'maria@example.com',
          username: 'maria',
        }),
      });
      expect(mockedSetDoc).toHaveBeenCalledWith(`${Collections.USERS}/user-123`, expect.objectContaining({
        _id: 'user-123',
        email: 'maria@example.com',
        username: 'maria',
      }));
    });

    it('returns the profile when Firestore read succeeds', async () => {
      const authUser = { uid: 'user-123', email: 'maria@example.com' };
      const profile = { name: 'Maria' };

      mockedSignInWithEmailAndPassword.mockResolvedValue({
        user: authUser,
      } as never);
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => profile,
      } as never);

      const result = await signInWithEmail('maria@example.com', 'password123');

      expect(result).toEqual({
        authUser,
        profile,
      });
    });

    it('returns the authenticated user even if profile sync fails', async () => {
      const authUser = { uid: 'user-123', email: 'maria@example.com' };
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      mockedSignInWithEmailAndPassword.mockResolvedValue({
        user: authUser,
      } as never);
      mockedGetDoc.mockRejectedValue(new Error('Missing or insufficient permissions.'));

      const result = await signInWithEmail('maria@example.com', 'password123');

      expect(result).toEqual({
        authUser,
        profile: null,
      });
      expect(warnSpy).toHaveBeenCalledWith(
        'Profile fetch failed after successful login.',
        expect.any(Error),
      );
    });
  });
});
