import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';

export type BugType = 'ui' | 'funcional' | 'desempenho' | 'conteudo' | 'outro';

export interface StorableBugReport {
  id?: string;
  userId: string;
  type: BugType;
  description: string;
  imageUrls?: string[];
  createdAt?: any;
}

export async function createBugReport(report: Omit<StorableBugReport, 'id' | 'createdAt'>) {
  const data = {
    ...report,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, Collections.BUGREPORTS), data as DocumentData);
  return ref.id;
}

export async function listBugReportsByUser(userId: string) {
  const q = query(collection(db, Collections.BUGREPORTS), where('userId', '==', userId));
  const snaps = await getDocs(q);
  return snaps.docs.map((s) => ({ ...(s.data() as StorableBugReport), id: s.id }));
}
