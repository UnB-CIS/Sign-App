jest.mock('../../firebase', () => ({
  storage: 'mock-storage',
}));

jest.mock('firebase/storage', () => ({
  deleteObject: jest.fn(),
  getDownloadURL: jest.fn(),
  ref: jest.fn((_storage, path) => ({ fullPath: path, path })),
  uploadBytes: jest.fn(),
}));

import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  deleteFileByUrl,
  MAX_BUG_REPORT_IMAGES,
  MAX_UPLOAD_SIZE_BYTES,
  uploadBugReportImages,
  uploadUserAvatar,
  validateBugReportImages,
  validateImageAsset,
} from '../../storage';

describe('storage service', () => {
  const mockedDeleteObject = deleteObject as jest.MockedFunction<typeof deleteObject>;
  const mockedGetDownloadURL = getDownloadURL as jest.MockedFunction<typeof getDownloadURL>;
  const mockedRef = ref as jest.MockedFunction<typeof ref>;
  const mockedUploadBytes = uploadBytes as jest.MockedFunction<typeof uploadBytes>;
  const originalXmlHttpRequest = global.XMLHttpRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRef.mockImplementation(((_storage, path) => ({ fullPath: path, path })) as typeof ref);
    mockedGetDownloadURL.mockResolvedValue('https://example.com/uploaded-file.jpg');
    mockedUploadBytes.mockResolvedValue({} as never);

    class MockXMLHttpRequest {
      responseType = '';
      response = { close: jest.fn() };
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;

      open = jest.fn();
      send = jest.fn(() => {
        this.onload?.();
      });
    }

    // @ts-ignore
    global.XMLHttpRequest = MockXMLHttpRequest;
  });

  afterEach(() => {
    global.XMLHttpRequest = originalXmlHttpRequest;
  });

  it('uploads a user avatar and returns the download URL', async () => {
    const uploaded = await uploadUserAvatar('user-123', {
      uri: 'file:///avatar.jpg',
      fileName: 'avatar.jpg',
      type: 'image/jpeg',
      fileSize: 1024,
    });

    expect(mockedUploadBytes).toHaveBeenCalled();
    expect(uploaded.downloadUrl).toBe('https://example.com/uploaded-file.jpg');
    expect(uploaded.fullPath).toContain('avatars/user-123/');
  });

  it('rejects oversized images and bug report image limits', () => {
    expect(() => validateImageAsset({
      uri: 'file:///big.jpg',
      fileName: 'big.jpg',
      type: 'image/jpeg',
      fileSize: MAX_UPLOAD_SIZE_BYTES + 1,
    })).toThrow('Cada imagem deve ter no máximo 5 MB.');

    expect(() => validateBugReportImages(
      Array.from({ length: MAX_BUG_REPORT_IMAGES + 1 }, (_, index) => ({
        uri: `file:///bug-${index}.jpg`,
      })),
    )).toThrow(`Máximo de ${MAX_BUG_REPORT_IMAGES} imagens por report.`);
  });

  it('uploads bug report images and deletes files by URL', async () => {
    const uploaded = await uploadBugReportImages('user-123', 'bug-123', [{
      uri: 'file:///bug-1.jpg',
      fileName: 'bug-1.jpg',
      type: 'image/jpeg',
      fileSize: 1024,
    }]);

    expect(uploaded[0].fullPath).toContain('bug-reports/user-123/bug-123/');

    await deleteFileByUrl('https://example.com/uploaded-file.jpg');

    expect(mockedDeleteObject).toHaveBeenCalled();
  });
});
