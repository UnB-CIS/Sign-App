import { doc, getDoc, serverTimestamp, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from 'firebase/auth';
import { Collections } from '../enums';
interface Users {
    _id: string;
    username: string;
    email: string;
    name?: string;
    profilePictureUrl?: string;
    createdAt?: Timestamp | ReturnType<typeof serverTimestamp>;
    streak?: Streak;
    xp?: number;
    xpEarnedThisWeek?: number;
    activeCourseId?: string | null;
    currentLeague?: currentLeague | null;
    settings?: Settings;
}
interface Streak {
    current: number;
    longest: number;
    lastPracticedAt?: Timestamp;
}

interface Settings {
    notifications: {
        practiceReminders: boolean;
        friendUpdates: boolean;
    }
}

interface currentLeague {
    name: string;
    id: string;
}

async function registerUserWithEmail(
    { email, password, username, name, profileFile }: { email: string; password: string; username: string; name?: string; profileFile?: File | null }
): Promise<string> {

    try {

        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)

        const user = userCredential.user;
        if (name) {
            await updateProfile(user, { displayName: name });
        }
        const userDoc: Users = {
            _id: user.uid,
            username,
            email,
            name: name ?? undefined,
            profilePictureUrl: profileFile ? `profiles/${user.uid}/${profileFile.name}` : undefined,
            createdAt: serverTimestamp(),
            streak: { current: 0, longest: 0 },
            xp: 0,
            xpEarnedThisWeek: 0,
            activeCourseId: null,
            currentLeague: null,
            settings: { notifications: { practiceReminders: true, friendUpdates: false } },
        }
        await setDoc(doc(db, Collections.USERS, user.uid), userDoc);
        return user.uid;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Registration failed: ${message}`);
    }
}

async function signInWithEmail(email: string, password: string) {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const snap = await getDoc(doc(db, 'users', uid));
    return { authUser: cred.user, profile: snap.exists() ? snap.data() : null };
}
async function getCurrentUserById(uid: string): Promise<Users | null> {
    const snap = await getDoc(doc(db, Collections.USERS, uid));
    return snap.exists() ? snap.data() as Users : null;
}



async function updateUserProfile(
    uid: string,
    updates: Partial<Pick<Users, 'name' | 'username' | 'profilePictureUrl' | 'settings'>> & Record<string, any>
) {
    const ref = doc(db, Collections.USERS, uid);
    await updateDoc(ref, updates);
}

async function getUserStreak(uid: string): Promise<Streak | null> {
    const user = await getCurrentUserById(uid);
    return user?.streak ?? null;
}

export { registerUserWithEmail, signInWithEmail, getCurrentUserById, updateUserProfile, getUserStreak };