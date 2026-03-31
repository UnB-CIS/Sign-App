import { deleteField, doc, getDoc, serverTimestamp, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User, UserCredential } from 'firebase/auth';
import { Collections } from '../enums';

export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    name?: string;
    phone?: string;
    gender?: string;
    birth_date?: string;
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

export type UserProfileUpdates =
    Partial<Pick<UserProfile, 'name' | 'username' | 'phone' | 'gender' | 'birth_date' | 'profilePictureUrl' | 'settings'>>
    & Record<string, any>;

const BIRTH_DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

function normalizeOptionalString(value?: string | null) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}

function normalizeDate(value: Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDayDifference(from: Date, to: Date) {
    const diffMs = normalizeDate(to).getTime() - normalizeDate(from).getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function timestampToDate(value: unknown): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate();
    }

    if (typeof value === 'string') {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
}

function isValidBirthDate(value: string) {
    if (!BIRTH_DATE_REGEX.test(value)) return false;

    const [day, month, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();

    return (
        date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day
        && year >= 1900
        && date <= now
    );
}

function buildUserProfileUpdates(updates: UserProfileUpdates) {
    const sanitized: Record<string, any> = { ...updates };

    if (typeof updates.name === 'string') {
        const name = updates.name.trim();
        if (!name) {
            throw new Error('Preencha o nome completo.');
        }
        sanitized.name = name;
    }

    if (typeof updates.username === 'string') {
        const username = updates.username.trim();
        if (!username) {
            throw new Error('Informe um nome de usuário válido.');
        }
        sanitized.username = username;
    }

    if ('phone' in updates) {
        const phone = normalizeOptionalString(updates.phone);
        if (phone) {
            const digits = phone.replace(/\D/g, '');
            if (digits.length < 10 || digits.length > 11) {
                throw new Error('Informe um telefone com 10 ou 11 dígitos.');
            }
            sanitized.phone = phone;
        } else {
            sanitized.phone = deleteField();
        }
    }

    if ('gender' in updates) {
        const gender = normalizeOptionalString(updates.gender);
        if (gender && gender.length < 2) {
            throw new Error('Informe um gênero válido.');
        }
        sanitized.gender = gender ?? deleteField();
    }

    if ('birth_date' in updates) {
        const birthDate = normalizeOptionalString(updates.birth_date);
        if (birthDate && !isValidBirthDate(birthDate)) {
            throw new Error('Informe a data de nascimento no formato DD/MM/AAAA.');
        }
        sanitized.birth_date = birthDate ?? deleteField();
    }

    if ('profilePictureUrl' in updates && typeof updates.profilePictureUrl === 'string') {
        const profilePictureUrl = normalizeOptionalString(updates.profilePictureUrl);
        sanitized.profilePictureUrl = profilePictureUrl ?? deleteField();
    }

    return sanitized;
}

function buildUsernameFromEmail(email?: string | null, uid?: string) {
    const emailPrefix = email?.split('@')[0]?.trim();
    if (emailPrefix) {
        return emailPrefix;
    }

    if (uid) {
        return `user_${uid.slice(0, 8)}`;
    }

    return 'user';
}

function buildBaseUserProfile(user: Pick<User, 'uid' | 'email' | 'displayName'>): UserProfile {
    const name = normalizeOptionalString(user.displayName);

    return {
        _id: user.uid,
        username: buildUsernameFromEmail(user.email, user.uid),
        email: user.email ?? '',
        ...(name ? { name } : {}),
        createdAt: serverTimestamp(),
        streak: { current: 0, longest: 0 },
        xp: 0,
        xpEarnedThisWeek: 0,
        activeCourseId: null,
        currentLeague: null,
        settings: { notifications: { practiceReminders: true, friendUpdates: false } },
    };
}

async function ensureUserProfileDocument(user: Pick<User, 'uid' | 'email' | 'displayName'>): Promise<UserProfile> {
    const ref = doc(db, Collections.USERS, user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        return snap.data() as UserProfile;
    }

    const userDoc = buildBaseUserProfile(user);
    await setDoc(ref, userDoc);
    return userDoc;
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
        const userDoc: UserProfile = {
            _id: user.uid,
            username,
            email,
            ...(name ? { name } : {}),
            ...(profileFile ? { profilePictureUrl: `profiles/${user.uid}/${profileFile.name}` } : {}),
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
    try {
        const profile = await ensureUserProfileDocument(cred.user);
        return { authUser: cred.user, profile };
    } catch (error) {
        console.warn('Profile fetch failed after successful login.', error);
        return { authUser: cred.user, profile: null };
    }
}
async function getCurrentUserById(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, Collections.USERS, uid));
    return snap.exists() ? snap.data() as UserProfile : null;
}



async function updateUserProfile(
    uid: string,
    updates: UserProfileUpdates
) {
    const ref = doc(db, Collections.USERS, uid);
    if (auth.currentUser?.uid === uid) {
        await ensureUserProfileDocument(auth.currentUser);
    }
    await updateDoc(ref, buildUserProfileUpdates(updates));
}

async function getUserStreak(uid: string): Promise<Streak | null> {
    const user = await getCurrentUserById(uid);
    return user?.streak ?? null;
}

async function applyLessonRewards(uid: string, xpEarned: number, completedAt = new Date()) {
    if (auth.currentUser?.uid === uid) {
        await ensureUserProfileDocument(auth.currentUser);
    }

    const user = await getCurrentUserById(uid);
    const currentXp = user?.xp ?? 0;
    const currentWeeklyXp = user?.xpEarnedThisWeek ?? 0;
    const currentStreak = user?.streak?.current ?? 0;
    const longestStreak = user?.streak?.longest ?? 0;
    const lastPracticedAt = timestampToDate(user?.streak?.lastPracticedAt);

    let nextStreak = currentStreak > 0 ? currentStreak : 1;

    if (lastPracticedAt) {
        const dayDifference = getDayDifference(lastPracticedAt, completedAt);

        if (dayDifference <= 0) {
            nextStreak = currentStreak > 0 ? currentStreak : 1;
        } else if (dayDifference === 1) {
            nextStreak = currentStreak + 1;
        } else {
            nextStreak = 1;
        }
    }

    await updateDoc(doc(db, Collections.USERS, uid), {
        xp: currentXp + xpEarned,
        xpEarnedThisWeek: currentWeeklyXp + xpEarned,
        streak: {
            current: nextStreak,
            longest: Math.max(longestStreak, nextStreak),
            lastPracticedAt: serverTimestamp(),
        },
    });
}

export { registerUserWithEmail, signInWithEmail, getCurrentUserById, updateUserProfile, getUserStreak, applyLessonRewards };
