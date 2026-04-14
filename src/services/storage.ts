import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadableImage {
  uri: string;
  fileName?: string | null;
  type?: string | null;
  fileSize?: number | null;
}

export interface UploadedImage {
  downloadUrl: string;
  fullPath: string;
  contentType: string;
  size: number | null;
}

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_BUG_REPORT_IMAGES = 3;

function ensureImageAsset(asset: UploadableImage) {
  if (!asset.uri) {
    throw new Error('Selecione uma imagem válida.');
  }

  if (asset.fileSize != null && asset.fileSize > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error('Cada imagem deve ter no máximo 5 MB.');
  }
}

function guessContentType(asset: UploadableImage) {
  if (asset.type?.startsWith('image/')) {
    return asset.type;
  }

  return 'image/jpeg';
}

function guessExtension(asset: UploadableImage) {
  const contentType = guessContentType(asset);
  const fileName = asset.fileName ?? '';
  const fileNameExtension = fileName.includes('.') ? fileName.split('.').pop() : null;

  if (fileNameExtension) {
    return fileNameExtension.toLowerCase();
  }

  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';

  return 'jpg';
}

function buildFileName(prefix: string, asset: UploadableImage) {
  const extension = guessExtension(asset);
  return `${prefix}-${Date.now()}.${extension}`;
}

function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response as Blob);
    };
    xhr.onerror = () => {
      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
}

async function uploadImage(path: string, asset: UploadableImage): Promise<UploadedImage> {
  ensureImageAsset(asset);

  const blob = await uriToBlob(asset.uri);
  const contentType = guessContentType(asset);
  const storageRef = ref(storage, path);

  try {
    await uploadBytes(storageRef, blob, { contentType });
    const downloadUrl = await getDownloadURL(storageRef);

    return {
      downloadUrl,
      fullPath: storageRef.fullPath,
      contentType,
      size: asset.fileSize ?? null,
    };
  } finally {
    if (typeof (blob as { close?: () => void }).close === 'function') {
      (blob as { close: () => void }).close();
    }
  }
}

export function validateImageAsset(asset: UploadableImage) {
  ensureImageAsset(asset);
}

export function validateBugReportImages(images: UploadableImage[]) {
  if (images.length > MAX_BUG_REPORT_IMAGES) {
    throw new Error(`Máximo de ${MAX_BUG_REPORT_IMAGES} imagens por report.`);
  }

  images.forEach(validateImageAsset);
}

export async function uploadUserAvatar(uid: string, asset: UploadableImage) {
  return uploadImage(`avatars/${uid}/${buildFileName('avatar', asset)}`, asset);
}

export async function uploadBugReportImages(uid: string, reportId: string, images: UploadableImage[]) {
  validateBugReportImages(images);

  return Promise.all(
    images.map((image, index) =>
      uploadImage(`bug-reports/${uid}/${reportId}/${buildFileName(`attachment-${index + 1}`, image)}`, image)),
  );
}

export async function deleteFileByUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return;
  }

  await deleteObject(ref(storage, fileUrl));
}
