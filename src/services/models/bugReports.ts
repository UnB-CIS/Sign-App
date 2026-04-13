import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';
import { deleteFileByUrl, UploadableImage, uploadBugReportImages, validateBugReportImages } from '../storage';

export type BugType = 'ui' | 'funcional' | 'desempenho' | 'conteudo' | 'outro';

export interface StorableBugReport {
  id?: string;
  userId: string;
  type: BugType;
  description: string;
  imageUrls?: string[];
  createdAt?: any;
}

export async function createBugReport(
  report: Omit<StorableBugReport, 'id' | 'createdAt' | 'imageUrls'> & { images?: UploadableImage[] },
) {
  const description = report.description.trim();
  if (!description) {
    throw new Error('Descreva o problema encontrado.');
  }

  const images = report.images ?? [];
  validateBugReportImages(images);

  const reportRef = doc(collection(db, Collections.BUGREPORTS));
  let uploadedImages: Awaited<ReturnType<typeof uploadBugReportImages>> = [];

  try {
    if (images.length > 0) {
      uploadedImages = await uploadBugReportImages(report.userId, reportRef.id, images);
    }

  const data = {
    userId: report.userId,
    type: report.type,
    description,
    ...(uploadedImages.length ? { imageUrls: uploadedImages.map((image) => image.downloadUrl) } : {}),
    createdAt: serverTimestamp(),
  };
    await setDoc(reportRef, data as DocumentData);
    return reportRef.id;
  } catch (error) {
    await Promise.all(uploadedImages.map((image) => deleteFileByUrl(image.downloadUrl).catch(() => undefined)));
    throw error;
  }
}

export async function listBugReportsByUser(userId: string) {
  const q = query(collection(db, Collections.BUGREPORTS), where('userId', '==', userId));
  const snaps = await getDocs(q);
  return snaps.docs.map((s) => ({ ...(s.data() as StorableBugReport), id: s.id }));
}
