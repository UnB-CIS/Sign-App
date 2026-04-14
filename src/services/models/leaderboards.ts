import {
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    runTransaction,
    serverTimestamp,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Collections } from '../enums';

export interface LeaderboardParticipant {
    userId: string;
    username: string;
    profilePictureUrl?: string;
    xpEarnedThisWeek: number;
}

export interface StorableLeaderboard {
    id?: string;
    leagueName: string;
    startDate: string; // ISO
    endDate: string; // ISO
    participants?: LeaderboardParticipant[];
    createdAt?: any;
    updatedAt?: any;
}

export async function createLeaderboard(initial: Partial<StorableLeaderboard>) {
    const data: Partial<StorableLeaderboard> = {
        leagueName: initial.leagueName ?? 'Untitled League',
        startDate: initial.startDate ?? new Date().toISOString(),
        endDate: initial.endDate ?? new Date().toISOString(),
        participants: initial.participants ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...initial,
    };

    if (initial.id) {
        const ref = doc(db, Collections.LEAGUES, initial.id);
        await setDoc(ref, data as DocumentData);
        return initial.id;
    }

    const ref = await addDoc(collection(db, Collections.LEAGUES), data as DocumentData);
    return ref.id;
}

export async function getLeaderboardById(id: string): Promise<(StorableLeaderboard & { id: string }) | null> {
    const ref = doc(db, Collections.LEAGUES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { ...(snap.data() as StorableLeaderboard), id: snap.id };
}

export async function updateLeaderboard(id: string, updates: Partial<StorableLeaderboard>) {
    const ref = doc(db, Collections.LEAGUES, id);
    try {
        await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() } as DocumentData);
    } catch (err) {
        console.error('updateLeaderboard error', err);
        throw err;
    }
}

export async function deleteLeaderboard(id: string) {
    const ref = doc(db, Collections.LEAGUES, id);
    try {
        await deleteDoc(ref);
    } catch (err) {
        console.error('deleteLeaderboard error', err);
        throw err;
    }
}

export async function listLeaderboardsActiveAt(nowIso?: string) {
    const now = nowIso ?? new Date().toISOString();
    const q = query(
        collection(db, Collections.LEAGUES),
        where('startDate', '<=', now),
        where('endDate', '>=', now)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((s) => ({ ...(s.data() as StorableLeaderboard), id: s.id }));
}

export async function addLeaderboardParticipant(leaderboardId: string, participant: LeaderboardParticipant) {
    const ref = doc(db, Collections.LEAGUES, leaderboardId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Leaderboard not found');
            const data = snap.data() as StorableLeaderboard;
            const participants = data.participants ?? [];
            const exists = participants.find((p) => p.userId === participant.userId);
            if (exists) {
                const updated = participants.map((p) => (p.userId === participant.userId ? { ...p, ...participant } : p));
                tx.update(ref, { participants: updated, updatedAt: serverTimestamp() } as DocumentData);
            } else {
                participants.push(participant);
                tx.update(ref, { participants, updatedAt: serverTimestamp() } as DocumentData);
            }
        });
    } catch (err) {
        console.error('addLeaderboardParticipant error', err);
        throw err;
    }
}

export async function removeLeaderboardParticipant(leaderboardId: string, userId: string) {
    const ref = doc(db, Collections.LEAGUES, leaderboardId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Leaderboard not found');
            const data = snap.data() as StorableLeaderboard;
            const participants = (data.participants ?? []).filter((p) => p.userId !== userId);
            tx.update(ref, { participants, updatedAt: serverTimestamp() } as DocumentData);
        });
    } catch (err) {
        console.error('removeLeaderboardParticipant error', err);
        throw err;
    }
}

export async function updateParticipantXP(leaderboardId: string, userId: string, xp: number) {
    const ref = doc(db, Collections.LEAGUES, leaderboardId);
    try {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists()) throw new Error('Leaderboard not found');
            const data = snap.data() as StorableLeaderboard;
            const participants = data.participants ?? [];
            const updated = participants.map((p) => (p.userId === userId ? { ...p, xpEarnedThisWeek: xp } : p));
            tx.update(ref, { participants: updated, updatedAt: serverTimestamp() } as DocumentData);
        });
    } catch (err) {
        console.error('updateParticipantXP error', err);
        throw err;
    }
}

export async function getTopParticipants(leaderboardId: string, limit = 10) {
    const snap = await getDoc(doc(db, Collections.LEAGUES, leaderboardId));
    if (!snap.exists()) return [];
    const data = snap.data() as StorableLeaderboard;
    const participants = data.participants ?? [];
    return participants.sort((a, b) => b.xpEarnedThisWeek - a.xpEarnedThisWeek).slice(0, limit);
}
