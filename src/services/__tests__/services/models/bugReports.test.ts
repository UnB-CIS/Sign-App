jest.mock('../../../firebase', () => ({
  db: 'mock-db',
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db, name) => `collection:${name}`),
  doc: jest.fn((_collectionRef?: string) => ({ id: 'bug-123' })),
  getDocs: jest.fn(),
  query: jest.fn((...parts) => parts),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  setDoc: jest.fn(),
  where: jest.fn((...parts) => parts),
}));

jest.mock('../../../storage', () => ({
  deleteFileByUrl: jest.fn(),
  uploadBugReportImages: jest.fn(),
  validateBugReportImages: jest.fn(),
}));

import { doc, setDoc } from 'firebase/firestore';
import { createBugReport } from '../../../models/bugReports';
import { deleteFileByUrl, uploadBugReportImages, validateBugReportImages } from '../../../storage';

describe('bugReports model', () => {
  const mockedDoc = doc as jest.MockedFunction<typeof doc>;
  const mockedSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
  const mockedDeleteFileByUrl = deleteFileByUrl as jest.MockedFunction<typeof deleteFileByUrl>;
  const mockedUploadBugReportImages = uploadBugReportImages as jest.MockedFunction<typeof uploadBugReportImages>;
  const mockedValidateBugReportImages = validateBugReportImages as jest.MockedFunction<typeof validateBugReportImages>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedDoc.mockImplementation(((_collectionRef?: string) => ({ id: 'bug-123' })) as typeof doc);
    mockedUploadBugReportImages.mockResolvedValue([
      {
        downloadUrl: 'https://example.com/bug-1.jpg',
        fullPath: 'bug-reports/user-123/bug-123/attachment-1.jpg',
        contentType: 'image/jpeg',
        size: 1024,
      },
    ]);
    mockedDeleteFileByUrl.mockResolvedValue(undefined);
  });

  it('uploads the selected images and persists their URLs', async () => {
    const bugId = await createBugReport({
      userId: 'user-123',
      type: 'ui',
      description: '  O botão ficou desalinhado  ',
      images: [{
        uri: 'file:///bug-1.jpg',
        fileName: 'bug-1.jpg',
        type: 'image/jpeg',
        fileSize: 1024,
      }],
    });

    expect(mockedValidateBugReportImages).toHaveBeenCalledWith([
      expect.objectContaining({ uri: 'file:///bug-1.jpg' }),
    ]);
    expect(mockedUploadBugReportImages).toHaveBeenCalledWith('user-123', 'bug-123', [
      expect.objectContaining({ uri: 'file:///bug-1.jpg' }),
    ]);
    expect(mockedSetDoc).toHaveBeenCalledWith(
      { id: 'bug-123' },
      expect.objectContaining({
        userId: 'user-123',
        type: 'ui',
        description: 'O botão ficou desalinhado',
        imageUrls: ['https://example.com/bug-1.jpg'],
      }),
    );
    expect(bugId).toBe('bug-123');
  });

  it('cleans up uploaded files when persisting the report fails', async () => {
    mockedSetDoc.mockRejectedValueOnce(new Error('Firestore unavailable'));

    await expect(createBugReport({
      userId: 'user-123',
      type: 'ui',
      description: 'Erro crítico',
      images: [{
        uri: 'file:///bug-1.jpg',
        fileName: 'bug-1.jpg',
        type: 'image/jpeg',
        fileSize: 1024,
      }],
    })).rejects.toThrow('Firestore unavailable');

    expect(mockedDeleteFileByUrl).toHaveBeenCalledWith('https://example.com/bug-1.jpg');
  });
});
